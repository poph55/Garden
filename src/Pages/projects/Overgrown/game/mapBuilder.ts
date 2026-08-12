import {
  GridCell,
  GridDecorationDefinition,
  GridEntityDefinition,
  GridMapDefinition,
  GridObjectDefinition,
  GridPoint,
} from './mapTypes'
import { validateGridMap } from './gridMap'

export type AsciiCellFactory = (point: GridPoint, symbol: string) => GridCell

export type AsciiMapOptions = Readonly<{
  id: string
  name: string
  shape: readonly string[]
  legend: Readonly<Record<string, GridCell | AsciiCellFactory>>
  spawns: Readonly<Record<string, GridPoint>>
  entities?: readonly GridEntityDefinition[]
  decorations?: readonly GridDecorationDefinition[]
  objects?: readonly GridObjectDefinition[]
  voidSymbol?: string
}>

export function createMapFromAscii(options: AsciiMapOptions): GridMapDefinition {
  const voidSymbol = options.voidSymbol ?? ' '
  if (Array.from(voidSymbol).length !== 1) throw new Error('voidSymbol must be exactly one character')

  const rows = options.shape.map((sourceRow, y) =>
    Array.from(sourceRow, (symbol, x): GridCell | null => {
      if (symbol === voidSymbol) return null
      const entry = options.legend[symbol]
      if (!entry) throw new Error(`Map ${options.id} has no legend entry for ${JSON.stringify(symbol)} at ${x},${y}`)
      return typeof entry === 'function' ? entry({ x, y }, symbol) : entry
    }),
  )

  const map: GridMapDefinition = {
    id: options.id,
    name: options.name,
    rows,
    spawns: options.spawns,
    entities: options.entities ?? [],
    decorations: options.decorations ?? [],
    objects: options.objects ?? [],
  }
  validateGridMap(map)
  return map
}
