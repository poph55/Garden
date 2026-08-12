import { GridMapDefinition } from '../mapTypes'
import { meadow } from './meadow'

export const DEFAULT_MAP_ID = meadow.id

const maps: ReadonlyMap<string, GridMapDefinition> = new Map([
  [meadow.id, meadow],
])

export function getMapDefinition(id: string) {
  const map = maps.get(id)
  if (!map) throw new Error(`Unknown grid map ${id}`)
  return map
}
