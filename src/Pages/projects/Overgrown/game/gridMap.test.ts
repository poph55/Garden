import { describe, expect, it } from 'vitest'
import { GridMapRuntime, validateGridMap } from './gridMap'
import { createMapFromAscii } from './mapBuilder'
import { meadow } from './maps/meadow'
import { GridMapDefinition, Tile } from './mapTypes'

describe('variable-shape map construction', () => {
  it('supports ragged rows, outer cutouts, and interior holes', () => {
    const map = createMapFromAscii({
      id: 'shape-test',
      name: 'Shape Test',
      shape: [
        ' .. ',
        '....',
        '. ..',
      ],
      legend: { '.': { ground: Tile.Ground } },
      spawns: { entrance: { x: 1, y: 0 } },
    })
    const runtime = new GridMapRuntime(map)

    expect(runtime.dimensions).toEqual({ width: 4, height: 3 })
    expect(runtime.hasCell({ x: 0, y: 0 })).toBe(false)
    expect(runtime.hasCell({ x: 1, y: 0 })).toBe(true)
    expect(runtime.hasCell({ x: 1, y: 2 })).toBe(false)
    expect(runtime.canEnter({ x: 1, y: 2 })).toBe(false)
  })

  it('derives independent dimensions for differently sized maps', () => {
    const small = createMapFromAscii({
      id: 'small',
      name: 'Small',
      shape: ['..'],
      legend: { '.': { ground: Tile.Ground } },
      spawns: { entrance: { x: 0, y: 0 } },
    })
    const tall = createMapFromAscii({
      id: 'tall',
      name: 'Tall',
      shape: ['.', '.', '.', '.'],
      legend: { '.': { ground: Tile.Ground } },
      spawns: { entrance: { x: 0, y: 0 } },
    })

    expect(new GridMapRuntime(small).dimensions).toEqual({ width: 2, height: 1 })
    expect(new GridMapRuntime(tall).dimensions).toEqual({ width: 1, height: 4 })
  })
})

describe('collision, occupancy, and interaction', () => {
  const map = createMapFromAscii({
    id: 'collision-test',
    name: 'Collision Test',
    shape: ['...', '.#.', '...'],
    legend: {
      '.': { ground: Tile.Ground },
      '#': {
        ground: Tile.Ground,
        structure: {
          tile: Tile.Structure,
          blocksMovement: true,
          interaction: { id: 'inspect-structure', kind: 'inspect', message: 'Structure' },
        },
      },
    },
    spawns: { entrance: { x: 0, y: 1 } },
    entities: [
      {
        id: 'npc',
        kind: 'npc',
        at: { x: 2, y: 1 },
        blocksMovement: true,
        interaction: { id: 'talk-npc', kind: 'talk', message: 'NPC' },
      },
    ],
  })

  it('combines cell, structure, entity, and void collision', () => {
    const runtime = new GridMapRuntime(map)
    runtime.addEntity({ id: 'player', kind: 'player', at: { x: 0, y: 1 }, blocksMovement: true })

    expect(runtime.canEnter({ x: 1, y: 1 }, 'player')).toBe(false)
    expect(runtime.canEnter({ x: 2, y: 1 }, 'player')).toBe(false)
    expect(runtime.canEnter({ x: -1, y: 1 }, 'player')).toBe(false)
    expect(runtime.canEnter({ x: 0, y: 0 }, 'player')).toBe(true)
  })

  it('returns interactions from structures and characters', () => {
    const runtime = new GridMapRuntime(map)

    expect(runtime.getInteractionsAt({ x: 1, y: 1 })[0]).toMatchObject({
      source: 'structure',
      interaction: { id: 'inspect-structure' },
    })
    expect(runtime.getInteractionsAt({ x: 2, y: 1 })[0]).toMatchObject({
      source: 'entity',
      entityId: 'npc',
      interaction: { id: 'talk-npc' },
    })
  })

  it('reserves destinations and commits occupancy atomically', () => {
    const openMap = createMapFromAscii({
      id: 'reservation-test',
      name: 'Reservation Test',
      shape: ['....'],
      legend: { '.': { ground: Tile.Ground } },
      spawns: { entrance: { x: 0, y: 0 } },
      entities: [{ id: 'other', kind: 'npc', at: { x: 3, y: 0 }, blocksMovement: true }],
    })
    const runtime = new GridMapRuntime(openMap)
    runtime.addEntity({ id: 'player', kind: 'player', at: { x: 0, y: 0 }, blocksMovement: true })

    expect(runtime.reserveMove('player', { x: 1, y: 0 })).toBe(true)
    expect(runtime.reserveMove('other', { x: 1, y: 0 })).toBe(false)
    expect(runtime.getEntity('player')?.at).toEqual({ x: 0, y: 0 })

    runtime.commitMove('player', { x: 1, y: 0 })
    expect(runtime.getEntity('player')?.at).toEqual({ x: 1, y: 0 })
    expect(runtime.getEntitiesAt({ x: 0, y: 0 })).toHaveLength(0)
    expect(runtime.getEntitiesAt({ x: 1, y: 0 }).map((entity) => entity.id)).toEqual(['player'])
  })

  it('moves through the farm and reaches a multi-cell object interaction', () => {
    const runtime = new GridMapRuntime(meadow)
    runtime.addEntity({
      id: 'player',
      kind: 'player',
      at: meadow.spawns.entrance,
      blocksMovement: true,
    })

    for (const y of [19, 18, 17, 16, 15, 14, 13, 12]) {
      const destination = { x: 16, y }
      expect(runtime.reserveMove('player', destination)).toBe(true)
      runtime.commitMove('player', destination)
    }

    expect(runtime.getEntity('player')?.at).toEqual({ x: 16, y: 12 })
    expect(runtime.canEnter({ x: 16, y: 11 }, 'player')).toBe(false)
    expect(runtime.canEnter({ x: 23, y: 14 }, 'player')).toBe(false)
    expect(runtime.canEnter({ x: 6, y: 13 }, 'player')).toBe(false)
    expect(runtime.canEnter({ x: 8, y: 18 }, 'player')).toBe(true)
    expect(runtime.getInteractionsAt({ x: 16, y: 11 })[0]).toMatchObject({
      source: 'object',
      objectId: 'farmhouse',
      interaction: { id: 'farmhouse-door' },
    })
    expect(runtime.hasCell({ x: 0, y: 0 })).toBe(true)
    expect(runtime.canEnter({ x: 0, y: 0 }, 'player')).toBe(false)
    expect(runtime.canEnter({ x: 31, y: 25 }, 'player')).toBe(false)

    for (let x = 0; x < runtime.dimensions.width; x += 1) {
      expect(runtime.canEnter({ x, y: 0 }, 'player')).toBe(false)
      expect(runtime.canEnter({ x, y: runtime.dimensions.height - 1 }, 'player')).toBe(false)
    }
    for (let y = 0; y < runtime.dimensions.height; y += 1) {
      expect(runtime.canEnter({ x: 0, y }, 'player')).toBe(false)
      expect(runtime.canEnter({ x: runtime.dimensions.width - 1, y }, 'player')).toBe(false)
    }
  })
})

describe('map validation', () => {
  it('rejects a spawn placed in the void', () => {
    expect(() => createMapFromAscii({
      id: 'bad-spawn',
      name: 'Bad Spawn',
      shape: [' .'],
      legend: { '.': { ground: Tile.Ground } },
      spawns: { entrance: { x: 0, y: 0 } },
    })).toThrow(/spawn entrance is outside the playable shape/)
  })

  it('rejects duplicate entity ids', () => {
    const invalidMap: GridMapDefinition = {
      id: 'duplicate-entities',
      name: 'Duplicate Entities',
      rows: [[{ ground: Tile.Ground }, { ground: Tile.Ground }]],
      spawns: { entrance: { x: 0, y: 0 } },
      entities: [
        { id: 'same', kind: 'npc', at: { x: 0, y: 0 } },
        { id: 'same', kind: 'npc', at: { x: 1, y: 0 } },
      ],
      decorations: [],
      objects: [],
    }

    expect(() => validateGridMap(invalidMap)).toThrow(/duplicate entity id same/)
  })
})
