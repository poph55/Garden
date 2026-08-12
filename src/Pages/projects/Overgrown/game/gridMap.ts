import {
  GridCell,
  GridEntityDefinition,
  GridInteraction,
  GridKey,
  GridMapDefinition,
  GridMapDimensions,
  GridObjectDefinition,
  GridPoint,
  addGridPoints,
  gridKey,
} from './mapTypes'

type MutableEntityState = {
  id: string
  kind: string
  at: GridPoint
  blocksMovement: boolean
  interaction?: GridInteraction
}

export type GridEntityState = Readonly<MutableEntityState>

export type InteractionTarget = Readonly<{
  source: 'cell' | 'structure' | 'entity' | 'object'
  at: GridPoint
  interaction: GridInteraction
  entityId?: string
  objectId?: string
}>

const objectFootprint = (object: GridObjectDefinition) =>
  (object.footprint?.length ? object.footprint : [{ x: 0, y: 0 }]).map((offset) => addGridPoints(object.at, offset))

const objectInteractionPoints = (object: GridObjectDefinition) =>
  (object.interactionOffsets?.length ? object.interactionOffsets : [{ x: 0, y: 0 }])
    .map((offset) => addGridPoints(object.at, offset))

export function getMapDimensions(map: GridMapDefinition): GridMapDimensions {
  return {
    width: map.rows.reduce((largest, row) => Math.max(largest, row.length), 0),
    height: map.rows.length,
  }
}

export function getDefinitionCell(map: GridMapDefinition, point: GridPoint): GridCell | null {
  if (!Number.isInteger(point.x) || !Number.isInteger(point.y) || point.x < 0 || point.y < 0) return null
  return map.rows[point.y]?.[point.x] ?? null
}

function validateInteraction(interaction: GridInteraction, context: string) {
  if (!interaction.id.trim()) throw new Error(`${context} has an empty interaction id`)
  if (interaction.kind === 'exit' && (!interaction.targetMap || !interaction.targetSpawn)) {
    throw new Error(`${context} exit interaction requires targetMap and targetSpawn`)
  }
}

export function validateGridMap(map: GridMapDefinition): GridMapDimensions {
  if (!map.id.trim()) throw new Error('Grid map id cannot be empty')
  if (!map.name.trim()) throw new Error(`Grid map ${map.id} has an empty name`)
  if (map.rows.length === 0) throw new Error(`Grid map ${map.id} has no rows`)

  const dimensions = getMapDimensions(map)
  let cellCount = 0

  map.rows.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (!cell) return
      cellCount += 1
      if (!Number.isInteger(cell.ground) || cell.ground < 0) {
        throw new Error(`Grid map ${map.id} cell ${x},${y} has an invalid ground tile`)
      }
      if (cell.interaction) validateInteraction(cell.interaction, `Grid map ${map.id} cell ${x},${y}`)
      if (cell.structure) {
        if (!Number.isInteger(cell.structure.tile) || cell.structure.tile < 0) {
          throw new Error(`Grid map ${map.id} structure ${x},${y} has an invalid tile`)
        }
        if (cell.structure.interaction) {
          validateInteraction(cell.structure.interaction, `Grid map ${map.id} structure ${x},${y}`)
        }
      }
    })
  })

  if (cellCount === 0) throw new Error(`Grid map ${map.id} has no playable cells`)

  const blockingEntities = new Set<GridKey>()
  const blockingObjects = new Set<GridKey>()
  const objectIds = new Set<string>()
  for (const object of map.objects) {
    if (!object.id.trim()) throw new Error(`Grid map ${map.id} has an object with an empty id`)
    if (!object.asset.trim()) throw new Error(`Grid map ${map.id} object ${object.id} has an empty asset key`)
    if (objectIds.has(object.id)) throw new Error(`Grid map ${map.id} has duplicate object id ${object.id}`)
    objectIds.add(object.id)
    if (object.interaction) validateInteraction(object.interaction, `Grid map ${map.id} object ${object.id}`)

    for (const point of objectFootprint(object)) {
      const cell = getDefinitionCell(map, point)
      if (!cell) throw new Error(`Grid map ${map.id} object ${object.id} footprint is outside the playable shape`)
      if (!object.blocksMovement) continue
      if (cell.blocked || cell.structure?.blocksMovement) {
        throw new Error(`Grid map ${map.id} blocking object ${object.id} overlaps a blocked cell`)
      }
      const key = gridKey(point)
      if (blockingObjects.has(key)) throw new Error(`Grid map ${map.id} has overlapping blocking objects at ${key}`)
      blockingObjects.add(key)
    }

    for (const point of objectInteractionPoints(object)) {
      if (!getDefinitionCell(map, point)) {
        throw new Error(`Grid map ${map.id} object ${object.id} interaction is outside the playable shape`)
      }
    }
  }

  const decorationIds = new Set<string>()
  for (const decoration of map.decorations) {
    if (!decoration.id.trim()) throw new Error(`Grid map ${map.id} has a decoration with an empty id`)
    if (!decoration.asset.trim()) throw new Error(`Grid map ${map.id} decoration ${decoration.id} has an empty asset key`)
    if (decorationIds.has(decoration.id)) {
      throw new Error(`Grid map ${map.id} has duplicate decoration id ${decoration.id}`)
    }
    decorationIds.add(decoration.id)
    if (!getDefinitionCell(map, decoration.at)) {
      throw new Error(`Grid map ${map.id} decoration ${decoration.id} is outside the playable shape`)
    }
  }

  const entityIds = new Set<string>()
  for (const entity of map.entities) {
    if (!entity.id.trim()) throw new Error(`Grid map ${map.id} has an entity with an empty id`)
    if (entityIds.has(entity.id)) throw new Error(`Grid map ${map.id} has duplicate entity id ${entity.id}`)
    entityIds.add(entity.id)

    const cell = getDefinitionCell(map, entity.at)
    if (!cell) throw new Error(`Grid map ${map.id} entity ${entity.id} is outside the playable shape`)
    if (entity.interaction) validateInteraction(entity.interaction, `Grid map ${map.id} entity ${entity.id}`)

    if (entity.blocksMovement) {
      if (cell.blocked || cell.structure?.blocksMovement || blockingObjects.has(gridKey(entity.at))) {
        throw new Error(`Grid map ${map.id} blocking entity ${entity.id} is placed on a blocked cell`)
      }
      const key = gridKey(entity.at)
      if (blockingEntities.has(key)) throw new Error(`Grid map ${map.id} has multiple blocking entities at ${key}`)
      blockingEntities.add(key)
    }
  }

  const spawnNames = Object.keys(map.spawns)
  if (spawnNames.length === 0) throw new Error(`Grid map ${map.id} requires at least one spawn`)
  for (const [name, point] of Object.entries(map.spawns)) {
    const cell = getDefinitionCell(map, point)
    if (!cell) throw new Error(`Grid map ${map.id} spawn ${name} is outside the playable shape`)
    if (
      cell.blocked
      || cell.structure?.blocksMovement
      || blockingEntities.has(gridKey(point))
      || blockingObjects.has(gridKey(point))
    ) {
      throw new Error(`Grid map ${map.id} spawn ${name} is blocked`)
    }
  }

  return dimensions
}

export class GridMapRuntime {
  readonly definition: GridMapDefinition
  readonly dimensions: GridMapDimensions

  private readonly entities = new Map<string, MutableEntityState>()
  private readonly occupants = new Map<GridKey, Set<string>>()
  private readonly reservations = new Map<GridKey, string>()
  private readonly reservationByEntity = new Map<string, GridKey>()
  private readonly objectsByCell = new Map<GridKey, GridObjectDefinition[]>()
  private readonly interactiveObjectsByCell = new Map<GridKey, GridObjectDefinition[]>()

  constructor(definition: GridMapDefinition) {
    this.definition = definition
    this.dimensions = validateGridMap(definition)
    for (const object of definition.objects) {
      for (const point of objectFootprint(object)) {
        const key = gridKey(point)
        const objects = this.objectsByCell.get(key) ?? []
        objects.push(object)
        this.objectsByCell.set(key, objects)
      }
      if (object.interaction) {
        for (const point of objectInteractionPoints(object)) {
          const key = gridKey(point)
          const objects = this.interactiveObjectsByCell.get(key) ?? []
          objects.push(object)
          this.interactiveObjectsByCell.set(key, objects)
        }
      }
    }
    for (const entity of definition.entities) this.addEntity(entity)
  }

  getCell(point: GridPoint) {
    return getDefinitionCell(this.definition, point)
  }

  hasCell(point: GridPoint) {
    return this.getCell(point) !== null
  }

  cellEntries() {
    const entries: { point: GridPoint; cell: GridCell }[] = []
    this.definition.rows.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) entries.push({ point: { x, y }, cell })
      })
    })
    return entries
  }

  getEntity(id: string): GridEntityState | null {
    const entity = this.entities.get(id)
    return entity ? { ...entity, at: { ...entity.at } } : null
  }

  getEntities(): readonly GridEntityState[] {
    return [...this.entities.values()].map((entity) => ({ ...entity, at: { ...entity.at } }))
  }

  getEntitiesAt(point: GridPoint): readonly GridEntityState[] {
    const ids = this.occupants.get(gridKey(point))
    if (!ids) return []
    return [...ids].map((id) => this.getEntity(id)).filter((entity): entity is GridEntityState => entity !== null)
  }

  getObjectsAt(point: GridPoint): readonly GridObjectDefinition[] {
    return this.objectsByCell.get(gridKey(point)) ?? []
  }

  addEntity(definition: GridEntityDefinition) {
    if (this.entities.has(definition.id)) throw new Error(`Entity ${definition.id} already exists`)
    const cell = this.getCell(definition.at)
    if (!cell) throw new Error(`Entity ${definition.id} is outside the playable shape`)
    if (definition.blocksMovement && !this.canEnter(definition.at)) {
      throw new Error(`Blocking entity ${definition.id} cannot enter ${gridKey(definition.at)}`)
    }

    const entity: MutableEntityState = {
      id: definition.id,
      kind: definition.kind,
      at: { ...definition.at },
      blocksMovement: definition.blocksMovement ?? false,
      interaction: definition.interaction,
    }
    this.entities.set(entity.id, entity)
    this.addOccupant(entity.at, entity.id)
  }

  removeEntity(id: string) {
    const entity = this.entities.get(id)
    if (!entity) return false
    this.cancelMove(id)
    this.removeOccupant(entity.at, id)
    this.entities.delete(id)
    return true
  }

  canEnter(point: GridPoint, entityId?: string) {
    const cell = this.getCell(point)
    if (
      !cell
      || cell.blocked
      || cell.structure?.blocksMovement
      || this.getObjectsAt(point).some((object) => object.blocksMovement)
    ) return false

    const reservedBy = this.reservations.get(gridKey(point))
    if (reservedBy && reservedBy !== entityId) return false

    return this.getEntitiesAt(point).every((entity) => entity.id === entityId || !entity.blocksMovement)
  }

  reserveMove(entityId: string, destination: GridPoint) {
    const entity = this.entities.get(entityId)
    if (!entity) throw new Error(`Unknown entity ${entityId}`)
    if (!this.canEnter(destination, entityId)) return false

    this.cancelMove(entityId)
    const destinationKey = gridKey(destination)
    this.reservations.set(destinationKey, entityId)
    this.reservationByEntity.set(entityId, destinationKey)
    return true
  }

  commitMove(entityId: string, destination: GridPoint) {
    const entity = this.entities.get(entityId)
    if (!entity) throw new Error(`Unknown entity ${entityId}`)
    const destinationKey = gridKey(destination)
    if (this.reservationByEntity.get(entityId) !== destinationKey || this.reservations.get(destinationKey) !== entityId) {
      throw new Error(`Entity ${entityId} has no reservation for ${destinationKey}`)
    }

    this.removeOccupant(entity.at, entityId)
    entity.at = { ...destination }
    this.addOccupant(entity.at, entityId)
    this.reservations.delete(destinationKey)
    this.reservationByEntity.delete(entityId)
  }

  cancelMove(entityId: string) {
    const destinationKey = this.reservationByEntity.get(entityId)
    if (!destinationKey) return
    if (this.reservations.get(destinationKey) === entityId) this.reservations.delete(destinationKey)
    this.reservationByEntity.delete(entityId)
  }

  getInteractionsAt(point: GridPoint): readonly InteractionTarget[] {
    const cell = this.getCell(point)
    if (!cell) return []
    const targets: InteractionTarget[] = []

    for (const entity of this.getEntitiesAt(point)) {
      if (entity.interaction) {
        targets.push({ source: 'entity', at: { ...point }, interaction: entity.interaction, entityId: entity.id })
      }
    }
    for (const object of this.interactiveObjectsByCell.get(gridKey(point)) ?? []) {
      if (!object.interaction) continue
      targets.push({
        source: 'object',
        at: { ...point },
        interaction: object.interaction,
        objectId: object.id,
      })
    }
    if (cell.structure?.interaction) {
      targets.push({ source: 'structure', at: { ...point }, interaction: cell.structure.interaction })
    }
    if (cell.interaction) targets.push({ source: 'cell', at: { ...point }, interaction: cell.interaction })
    return targets
  }

  private addOccupant(point: GridPoint, entityId: string) {
    const key = gridKey(point)
    const cellOccupants = this.occupants.get(key) ?? new Set<string>()
    cellOccupants.add(entityId)
    this.occupants.set(key, cellOccupants)
  }

  private removeOccupant(point: GridPoint, entityId: string) {
    const key = gridKey(point)
    const cellOccupants = this.occupants.get(key)
    if (!cellOccupants) return
    cellOccupants.delete(entityId)
    if (cellOccupants.size === 0) this.occupants.delete(key)
  }
}
