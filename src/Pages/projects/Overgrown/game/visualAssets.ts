import Phaser from 'phaser'
import forestMushroomsUrl from '../assets/modern-exteriors/forest-mushrooms.png'
import forestRockSmallUrl from '../assets/modern-exteriors/forest-rock-small.png'
import forestRockTallUrl from '../assets/modern-exteriors/forest-rock-tall.png'
import forestRockWideUrl from '../assets/modern-exteriors/forest-rock-wide.png'
import forestStumpUrl from '../assets/modern-exteriors/forest-stump.png'
import forestTreeBroadUrl from '../assets/modern-exteriors/forest-tree-broad.png'
import forestTreeRoundUrl from '../assets/modern-exteriors/forest-tree-round.png'
import forestTreeTealUrl from '../assets/modern-exteriors/forest-tree-teal.png'
import farmhouseUrl from '../assets/modern-farm/farmhouse.png'
import fenceBottomUrl from '../assets/modern-farm/fence-bottom.png'
import fenceBottomLeftUrl from '../assets/modern-farm/fence-bottom-left.png'
import fenceBottomRightUrl from '../assets/modern-farm/fence-bottom-right.png'
import fenceLeftUrl from '../assets/modern-farm/fence-left.png'
import fenceRightUrl from '../assets/modern-farm/fence-right.png'
import fenceTopUrl from '../assets/modern-farm/fence-top.png'
import fenceTopLeftUrl from '../assets/modern-farm/fence-top-left.png'
import fenceTopRightUrl from '../assets/modern-farm/fence-top-right.png'
import grassFlowers1Url from '../assets/modern-farm/grass-flowers-1.png'
import grassFlowers2Url from '../assets/modern-farm/grass-flowers-2.png'
import grassFlowers3Url from '../assets/modern-farm/grass-flowers-3.png'
import grassFlowers4Url from '../assets/modern-farm/grass-flowers-4.png'
import rockBigUrl from '../assets/modern-farm/rock-big.png'
import rockSmallUrl from '../assets/modern-farm/rock-small.png'
import signUrl from '../assets/modern-farm/sign.png'
import terrainUrl from '../assets/modern-farm/terrain.png'
import treeOakMediumUrl from '../assets/modern-farm/tree-oak-medium.png'
import treeOakSmallUrl from '../assets/modern-farm/tree-oak-small.png'
import wellUrl from '../assets/modern-farm/well.png'
import { GridMapDefinition, Tile } from './mapTypes'

export const TERRAIN_TEXTURE = 'modern-farm-terrain'

export const Visual = {
  ForestMushrooms: 'forest-mushrooms',
  ForestRockSmall: 'forest-rock-small',
  ForestRockTall: 'forest-rock-tall',
  ForestRockWide: 'forest-rock-wide',
  ForestStump: 'forest-stump',
  ForestTreeBroad: 'forest-tree-broad',
  ForestTreeRound: 'forest-tree-round',
  ForestTreeTeal: 'forest-tree-teal',
  Farmhouse: 'farmhouse',
  FenceTopLeft: 'fence-top-left',
  FenceTop: 'fence-top',
  FenceTopRight: 'fence-top-right',
  FenceLeft: 'fence-left',
  FenceRight: 'fence-right',
  FenceBottomLeft: 'fence-bottom-left',
  FenceBottom: 'fence-bottom',
  FenceBottomRight: 'fence-bottom-right',
  GrassFlowers1: 'grass-flowers-1',
  GrassFlowers2: 'grass-flowers-2',
  GrassFlowers3: 'grass-flowers-3',
  GrassFlowers4: 'grass-flowers-4',
  RockBig: 'rock-big',
  RockSmall: 'rock-small',
  Sign: 'sign',
  TreeOakMedium: 'tree-oak-medium',
  TreeOakSmall: 'tree-oak-small',
  Well: 'well',
} as const

type VisualAsset = Readonly<{
  url: string
  originX: number
  originY: number
  anchor: 'center' | 'cell-bottom'
}>

const bottom = (url: string, originX = 0.5): VisualAsset => ({
  url,
  originX,
  originY: 1,
  anchor: 'cell-bottom',
})

const centered = (url: string): VisualAsset => ({
  url,
  originX: 0.5,
  originY: 0.5,
  anchor: 'center',
})

const visualAssets: Readonly<Record<string, VisualAsset>> = {
  [Visual.ForestMushrooms]: centered(forestMushroomsUrl),
  [Visual.ForestRockSmall]: bottom(forestRockSmallUrl),
  [Visual.ForestRockTall]: bottom(forestRockTallUrl),
  [Visual.ForestRockWide]: bottom(forestRockWideUrl),
  [Visual.ForestStump]: bottom(forestStumpUrl, 0.25),
  [Visual.ForestTreeBroad]: bottom(forestTreeBroadUrl),
  [Visual.ForestTreeRound]: bottom(forestTreeRoundUrl),
  [Visual.ForestTreeTeal]: bottom(forestTreeTealUrl),
  [Visual.Farmhouse]: bottom(farmhouseUrl, 0.66),
  [Visual.FenceTopLeft]: bottom(fenceTopLeftUrl),
  [Visual.FenceTop]: bottom(fenceTopUrl),
  [Visual.FenceTopRight]: bottom(fenceTopRightUrl),
  [Visual.FenceLeft]: bottom(fenceLeftUrl),
  [Visual.FenceRight]: bottom(fenceRightUrl),
  [Visual.FenceBottomLeft]: bottom(fenceBottomLeftUrl),
  [Visual.FenceBottom]: bottom(fenceBottomUrl),
  [Visual.FenceBottomRight]: bottom(fenceBottomRightUrl),
  [Visual.GrassFlowers1]: centered(grassFlowers1Url),
  [Visual.GrassFlowers2]: centered(grassFlowers2Url),
  [Visual.GrassFlowers3]: centered(grassFlowers3Url),
  [Visual.GrassFlowers4]: centered(grassFlowers4Url),
  [Visual.RockBig]: bottom(rockBigUrl, 0.25),
  [Visual.RockSmall]: bottom(rockSmallUrl, 0.25),
  [Visual.Sign]: bottom(signUrl),
  [Visual.TreeOakMedium]: bottom(treeOakMediumUrl),
  [Visual.TreeOakSmall]: bottom(treeOakSmallUrl),
  [Visual.Well]: bottom(wellUrl, 0.25),
}

const groundFrames: Readonly<Record<number, number>> = {
  [Tile.Grass]: 67,
  [Tile.GrassAlt]: 67,
  [Tile.PathTopLeft]: 0,
  [Tile.PathTop]: 1,
  [Tile.PathTopRight]: 2,
  [Tile.PathLeft]: 32,
  [Tile.PathCenter]: 33,
  [Tile.PathRight]: 34,
  [Tile.PathBottomLeft]: 64,
  [Tile.PathBottom]: 65,
  [Tile.PathBottomRight]: 66,
}

export function getGroundFrame(tile: number) {
  const frame = groundFrames[tile]
  if (frame === undefined) throw new Error(`No terrain frame registered for logical tile ${tile}`)
  return frame
}

export function getVisualAsset(key: string) {
  const asset = visualAssets[key]
  if (!asset) throw new Error(`No visual asset registered for ${key}`)
  return asset
}

export function preloadMapAssets(scene: Phaser.Scene, map: GridMapDefinition) {
  scene.load.image(TERRAIN_TEXTURE, terrainUrl)
  const keys = new Set([
    ...map.decorations.map((decoration) => decoration.asset),
    ...map.objects.map((object) => object.asset),
  ])
  for (const key of keys) scene.load.image(key, getVisualAsset(key).url)
}
