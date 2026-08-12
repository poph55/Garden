export const TILE_SIZE = 16

// These IDs describe visual roles, not asset filenames. A future asset catalog
// can map them to imported tiles without changing map or gameplay data.
export const Tile = {
  Empty: -1,
  Grass: 0,
  GrassAlt: 1,
  PathTopLeft: 2,
  PathTop: 3,
  PathTopRight: 4,
  PathLeft: 5,
  PathCenter: 6,
  PathRight: 7,
  PathBottomLeft: 8,
  PathBottom: 9,
  PathBottomRight: 10,
  // Kept as aliases for existing maps and tests.
  Ground: 0,
  GroundAlt: 1,
  Structure: 2,
  InteractiveStructure: 3,
} as const

export type TileIndex = number
export type GridPoint = Readonly<{ x: number; y: number }>
export type GridKey = `${number},${number}`
export type Direction = 'up' | 'down' | 'left' | 'right'

export const DirectionVector: Readonly<Record<Direction, GridPoint>> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

export type InteractionKind = 'inspect' | 'talk' | 'exit' | 'custom'

export type GridInteraction = Readonly<{
  id: string
  kind: InteractionKind
  message?: string
  targetMap?: string
  targetSpawn?: string
}>

export type GridStructure = Readonly<{
  tile: TileIndex
  blocksMovement?: boolean
  interaction?: GridInteraction
}>

export type GridCell = Readonly<{
  ground: TileIndex
  blocked?: boolean
  interaction?: GridInteraction
  structure?: GridStructure
}>

export type GridEntityDefinition = Readonly<{
  id: string
  kind: string
  at: GridPoint
  blocksMovement?: boolean
  interaction?: GridInteraction
}>

export type GridDecorationDefinition = Readonly<{
  id: string
  asset: string
  at: GridPoint
}>

export type GridObjectDefinition = Readonly<{
  id: string
  asset: string
  at: GridPoint
  footprint?: readonly GridPoint[]
  blocksMovement?: boolean
  interaction?: GridInteraction
  interactionOffsets?: readonly GridPoint[]
}>

export type GridMapDefinition = Readonly<{
  id: string
  name: string
  rows: readonly (readonly (GridCell | null)[])[]
  spawns: Readonly<Record<string, GridPoint>>
  entities: readonly GridEntityDefinition[]
  decorations: readonly GridDecorationDefinition[]
  objects: readonly GridObjectDefinition[]
}>

export type GridMapDimensions = Readonly<{
  width: number
  height: number
}>

export const gridKey = ({ x, y }: GridPoint): GridKey => `${x},${y}`
export const addGridPoints = (a: GridPoint, b: GridPoint): GridPoint => ({ x: a.x + b.x, y: a.y + b.y })
