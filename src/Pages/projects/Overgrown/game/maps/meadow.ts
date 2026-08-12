import { createMapFromAscii } from '../mapBuilder'
import { GridObjectDefinition, GridPoint, Tile } from '../mapTypes'
import { Visual } from '../visualAssets'

const mapWidth = 32
const mapHeight = 26
const farmOffset = 2
const farmWidth = 28
const farmRowWidths = [18, 22, 24, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 26, 24, 22, 18]

const shape = Array.from({ length: mapHeight }, () => '.'.repeat(mapWidth))
const point = (x: number, y: number): GridPoint => ({ x, y })
const at = (x: number, y: number): GridPoint => point(x + farmOffset, y + farmOffset)

function rectangle(width: number, height: number, startX: number, startY: number) {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => point(startX + x, startY + y)),
  ).flat()
}

function isInsideFarm({ x, y }: GridPoint) {
  const localX = x - farmOffset
  const localY = y - farmOffset
  if (localY < 0 || localY >= farmRowWidths.length || localX < 0 || localX >= farmWidth) return false
  const rowWidth = farmRowWidths[localY]
  const left = Math.floor((farmWidth - rowWidth) / 2)
  return localX >= left && localX < left + rowWidth
}

const objects: GridObjectDefinition[] = [
  {
    id: 'farmhouse',
    asset: Visual.Farmhouse,
    at: at(14, 9),
    footprint: rectangle(8, 3, -4, -2),
    blocksMovement: true,
    interaction: {
      id: 'farmhouse-door',
      kind: 'inspect',
      message: 'The farmhouse is quiet. We can make its interior later.',
    },
  },
  {
    id: 'stone-well',
    asset: Visual.Well,
    at: at(21, 12),
    footprint: [point(0, 0), point(1, 0)],
    blocksMovement: true,
    interaction: {
      id: 'stone-well',
      kind: 'inspect',
      message: 'Cool water glints at the bottom of the well.',
    },
  },
  {
    id: 'farm-sign',
    asset: Visual.Sign,
    at: at(19, 15),
    blocksMovement: true,
    interaction: {
      id: 'farm-sign',
      kind: 'inspect',
      message: 'Overgrown Farm — mind the seedlings.',
    },
  },
  {
    id: 'rock-cluster',
    asset: Visual.RockBig,
    at: at(5, 8),
    footprint: [point(0, 0), point(1, 0)],
    blocksMovement: true,
  },
  {
    id: 'small-rock',
    asset: Visual.RockSmall,
    at: at(23, 16),
    footprint: [point(0, 0), point(1, 0)],
    blocksMovement: true,
  },
  {
    id: 'orchard-tree-west',
    asset: Visual.TreeOakSmall,
    at: at(3, 8),
    blocksMovement: true,
  },
  {
    id: 'orchard-tree-east',
    asset: Visual.TreeOakMedium,
    at: at(24, 9),
    blocksMovement: true,
  },
]

function addFenceRectangle(left: number, top: number, right: number, bottom: number) {
  const addFence = (id: string, asset: string, location: GridPoint) => {
    objects.push({ id, asset, at: location, blocksMovement: true })
  }

  addFence('garden-fence-top-left', Visual.FenceTopLeft, at(left, top))
  addFence('garden-fence-top-right', Visual.FenceTopRight, at(right, top))
  addFence('garden-fence-bottom-left', Visual.FenceBottomLeft, at(left, bottom))
  addFence('garden-fence-bottom-right', Visual.FenceBottomRight, at(right, bottom))

  for (let x = left + 1; x < right; x += 1) {
    addFence(`garden-fence-top-${x}`, Visual.FenceTop, at(x, top))
    if (x !== 6 && x !== 7) addFence(`garden-fence-bottom-${x}`, Visual.FenceBottom, at(x, bottom))
  }
  for (let y = top + 1; y < bottom; y += 1) {
    addFence(`garden-fence-left-${y}`, Visual.FenceLeft, at(left, y))
    addFence(`garden-fence-right-${y}`, Visual.FenceRight, at(right, y))
  }
}

addFenceRectangle(4, 11, 10, 16)

const forestTrees = [Visual.ForestTreeRound, Visual.ForestTreeTeal, Visual.ForestTreeBroad]
let forestTreeIndex = 0
for (let y = 1; y < mapHeight; y += 2) {
  const startX = y % 4 === 1 ? 0 : 1
  for (let x = startX; x < mapWidth; x += 2) {
    const location = point(x, y)
    if (isInsideFarm(location)) continue
    objects.push({
      id: `forest-tree-${forestTreeIndex + 1}`,
      asset: forestTrees[(Math.floor(x / 2) + Math.floor(y / 2) * 2) % forestTrees.length],
      at: location,
    })
    forestTreeIndex += 1
  }
}

const forestProps = [
  [Visual.ForestRockTall, point(1, 5)],
  [Visual.ForestRockWide, point(30, 7)],
  [Visual.ForestStump, point(1, 20)],
  [Visual.ForestRockSmall, point(30, 21)],
  [Visual.ForestRockTall, point(8, 25)],
  [Visual.ForestStump, point(24, 25)],
] as const

forestProps.forEach(([asset, location], index) => {
  objects.push({ id: `forest-prop-${index + 1}`, asset, at: location })
})

function groundAt(worldPoint: GridPoint) {
  const x = worldPoint.x - farmOffset
  const y = worldPoint.y - farmOffset
  const onPath = x >= 13 && x <= 15 && y >= 10 && y <= 20
  if (!onPath) return Tile.Grass
  if (y === 10) return [Tile.PathTopLeft, Tile.PathTop, Tile.PathTopRight][x - 13]
  if (y === 20) return [Tile.PathBottomLeft, Tile.PathBottom, Tile.PathBottomRight][x - 13]
  return [Tile.PathLeft, Tile.PathCenter, Tile.PathRight][x - 13]
}

export const meadow = createMapFromAscii({
  id: 'meadow',
  name: 'Overgrown Farm',
  shape,
  legend: {
    '.': (worldPoint) => ({
      ground: groundAt(worldPoint),
      blocked: !isInsideFarm(worldPoint),
    }),
  },
  spawns: {
    entrance: at(14, 18),
    west: at(11, 14),
  },
  objects,
  decorations: [
    { id: 'flowers-1', asset: Visual.GrassFlowers1, at: at(17, 13) },
    { id: 'flowers-2', asset: Visual.GrassFlowers2, at: at(18, 17) },
    { id: 'flowers-3', asset: Visual.GrassFlowers3, at: at(7, 9) },
    { id: 'flowers-4', asset: Visual.GrassFlowers4, at: at(22, 9) },
    { id: 'flowers-5', asset: Visual.GrassFlowers1, at: at(3, 11) },
    { id: 'flowers-6', asset: Visual.GrassFlowers2, at: at(24, 11) },
    { id: 'flowers-7', asset: Visual.GrassFlowers3, at: at(12, 16) },
    { id: 'flowers-8', asset: Visual.GrassFlowers4, at: at(16, 19) },
    { id: 'forest-mushrooms-1', asset: Visual.ForestMushrooms, at: point(3, 2) },
    { id: 'forest-mushrooms-2', asset: Visual.ForestMushrooms, at: point(28, 3) },
    { id: 'forest-mushrooms-3', asset: Visual.ForestMushrooms, at: point(2, 22) },
    { id: 'forest-mushrooms-4', asset: Visual.ForestMushrooms, at: point(29, 23) },
  ],
  entities: [
    {
      id: 'caretaker',
      kind: 'npc',
      at: at(18, 14),
      blocksMovement: true,
      interaction: {
        id: 'caretaker-greeting',
        kind: 'talk',
        message: 'The woods are thick enough that nothing wanders off the farm.',
      },
    },
  ],
})
