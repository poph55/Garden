import Phaser from 'phaser'
import { GridMapRuntime, InteractionTarget } from './gridMap'
import { DEFAULT_MAP_ID, getMapDefinition } from './maps'
import {
  Direction,
  DirectionVector,
  GridMapDefinition,
  GridPoint,
  TILE_SIZE,
  addGridPoints,
} from './mapTypes'
import {
  TERRAIN_TEXTURE,
  getGroundFrame,
  getVisualAsset,
  preloadMapAssets,
} from './visualAssets'

const PLAYER_ID = 'player'
const MOVE_DURATION = 180

type MoveIntent = Readonly<{ direction: Direction }>
type GridWorldSceneData = Readonly<{ mapId?: string; spawnId?: string }>

export class GridWorldScene extends Phaser.Scene {
  private mapDefinition!: GridMapDefinition
  private grid!: GridMapRuntime
  private tilemap!: Phaser.Tilemaps.Tilemap
  private groundLayer!: Phaser.Tilemaps.TilemapLayer
  private playerAnchor!: Phaser.GameObjects.Container
  private playerVisual!: Phaser.GameObjects.Rectangle
  private currentCell!: GridPoint
  private targetCell: GridPoint | null = null
  private queuedMove: MoveIntent | null = null
  private moving = false
  private facing: Direction = 'down'
  private worldOffset: GridPoint = { x: 0, y: 0 }
  private interactionText!: Phaser.GameObjects.Text
  private interactionTimer?: Phaser.Time.TimerEvent
  private keys!: Record<Direction, readonly Phaser.Input.Keyboard.Key[]>

  constructor() {
    super('grid-world')
  }

  init(data: GridWorldSceneData = {}) {
    this.mapDefinition = getMapDefinition(data.mapId ?? DEFAULT_MAP_ID)
    this.grid = new GridMapRuntime(this.mapDefinition)

    const spawnId = data.spawnId ?? 'entrance'
    const spawn = this.mapDefinition.spawns[spawnId]
    if (!spawn) throw new Error(`Map ${this.mapDefinition.id} has no spawn named ${spawnId}`)

    this.currentCell = { ...spawn }
    this.targetCell = null
    this.queuedMove = null
    this.moving = false
    this.facing = 'down'
    this.grid.addEntity({ id: PLAYER_ID, kind: 'player', at: spawn, blocksMovement: true })
  }

  preload() {
    preloadMapAssets(this, this.mapDefinition)
  }

  create() {
    this.configureWorldGeometry()
    this.createMapLayer()
    this.createDecorations()
    this.createStructures()
    this.createMapObjects()
    this.createMapEntities()
    this.createPlayer()
    this.createInteractionUi()
    this.createInput()
    this.configureCamera()

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.grid.cancelMove(PLAYER_ID)
      this.queuedMove = null
      this.interactionTimer?.remove(false)
    })
  }

  update() {
    if (this.moving) return
    const heldMove = this.getHeldMove()
    if (heldMove) this.requestMove(heldMove)
  }

  private configureWorldGeometry() {
    const mapWidth = this.grid.dimensions.width * TILE_SIZE
    const mapHeight = this.grid.dimensions.height * TILE_SIZE
    this.worldOffset = {
      x: Math.max(0, Math.floor((this.cameras.main.width - mapWidth) / 2)),
      y: Math.max(0, Math.floor((this.cameras.main.height - mapHeight) / 2)),
    }
  }

  private createMapLayer() {
    const { width, height } = this.grid.dimensions
    this.tilemap = this.make.tilemap({ tileWidth: TILE_SIZE, tileHeight: TILE_SIZE, width, height })

    const tiles = this.tilemap.addTilesetImage(
      TERRAIN_TEXTURE,
      TERRAIN_TEXTURE,
      TILE_SIZE,
      TILE_SIZE,
      0,
      0,
    )
    if (!tiles) throw new Error('Could not create framework tileset')

    const ground = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => {
        const cell = this.grid.getCell({ x, y })
        return cell ? getGroundFrame(cell.ground) : -1
      }),
    )
    const layer = this.tilemap.createBlankLayer('ground', tiles)
    if (!layer) throw new Error(`Could not create ground layer for map ${this.mapDefinition.id}`)

    this.groundLayer = layer
    this.groundLayer.putTilesAt(ground, 0, 0)
    this.groundLayer.setPosition(this.worldOffset.x, this.worldOffset.y)
    this.groundLayer.setDepth(0)
  }

  private createDecorations() {
    for (const decoration of this.mapDefinition.decorations) {
      const asset = getVisualAsset(decoration.asset)
      const world = this.gridToWorld(decoration.at)
      this.add.image(world.x, world.y, decoration.asset)
        .setOrigin(asset.originX, asset.originY)
        .setDepth(1)
        .setData('decorationId', decoration.id)
    }
  }

  private createStructures() {
    for (const { point, cell } of this.grid.cellEntries()) {
      if (!cell.structure) continue
      const world = this.gridToWorld(point)
      this.add.rectangle(world.x, world.y, TILE_SIZE - 4, TILE_SIZE - 4, 0x93693a)
        .setDepth(world.y + TILE_SIZE / 2)
    }
  }

  private createMapObjects() {
    for (const object of this.mapDefinition.objects) {
      const asset = getVisualAsset(object.asset)
      const world = this.gridToWorld(object.at)
      const y = world.y + (asset.anchor === 'cell-bottom' ? TILE_SIZE / 2 : 0)
      this.add.image(world.x, y, object.asset)
        .setOrigin(asset.originX, asset.originY)
        .setDepth(y)
        .setData('objectId', object.id)
    }
  }

  private createMapEntities() {
    for (const entity of this.grid.getEntities()) {
      if (entity.id === PLAYER_ID) continue
      const world = this.gridToWorld(entity.at)
      this.add.rectangle(world.x, world.y + TILE_SIZE / 2, 10, 14, 0xd8a3b4)
        .setOrigin(0.5, 1)
        .setDepth(world.y + TILE_SIZE / 2)
        .setData('entityId', entity.id)
    }
  }

  private createPlayer() {
    const world = this.gridToWorld(this.currentCell)
    this.playerVisual = this.add.rectangle(0, TILE_SIZE / 2, 10, 14, 0xeee3c4).setOrigin(0.5, 1)
    this.playerAnchor = this.add.container(world.x, world.y, this.playerVisual)
      .setDepth(world.y + TILE_SIZE / 2)
  }

  private createInteractionUi() {
    this.interactionText = this.add.text(6, 132, '', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#fff8dc',
      backgroundColor: '#1b2a22',
      padding: { x: 3, y: 2 },
      wordWrap: { width: 222, useAdvancedWrap: true },
    })
      .setScrollFactor(0)
      .setDepth(100_000)
      .setVisible(false)
  }

  private createInput() {
    const keyboard = this.input.keyboard
    if (!keyboard) throw new Error('Keyboard input is unavailable')
    keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    ])

    this.keys = {
      up: [keyboard.addKey('W'), keyboard.addKey('UP')],
      down: [keyboard.addKey('S'), keyboard.addKey('DOWN')],
      left: [keyboard.addKey('A'), keyboard.addKey('LEFT')],
      right: [keyboard.addKey('D'), keyboard.addKey('RIGHT')],
    }

    for (const direction of Object.keys(this.keys) as Direction[]) {
      for (const key of this.keys[direction]) {
        key.on('down', () => this.requestMove({ direction }))
      }
    }

    keyboard.addKey('SPACE').on('down', () => this.interact())
    keyboard.addKey('ENTER').on('down', () => this.interact())
  }

  private configureCamera() {
    const mapWidth = this.grid.dimensions.width * TILE_SIZE
    const mapHeight = this.grid.dimensions.height * TILE_SIZE
    const boundsWidth = Math.max(this.cameras.main.width, mapWidth)
    const boundsHeight = Math.max(this.cameras.main.height, mapHeight)
    this.cameras.main.setBounds(0, 0, boundsWidth, boundsHeight)
    this.cameras.main.startFollow(this.playerAnchor, true, 1, 1)
    this.cameras.main.roundPixels = true
  }

  private requestMove(intent: MoveIntent) {
    this.facing = intent.direction
    if (this.moving) {
      this.queuedMove = intent
      return
    }

    const destination = addGridPoints(this.currentCell, DirectionVector[intent.direction])
    if (!this.grid.reserveMove(PLAYER_ID, destination)) return

    this.moving = true
    this.targetCell = destination
    const targetWorld = this.gridToWorld(destination)
    this.tweens.add({
      targets: this.playerAnchor,
      x: targetWorld.x,
      y: targetWorld.y,
      duration: MOVE_DURATION,
      ease: 'Linear',
      onUpdate: () => this.playerAnchor.setDepth(this.playerAnchor.y + TILE_SIZE / 2),
      onComplete: () => this.completeMove(destination),
    })
  }

  private completeMove(destination: GridPoint) {
    this.grid.commitMove(PLAYER_ID, destination)
    this.currentCell = { ...destination }
    this.targetCell = null
    this.moving = false

    const nextMove = this.queuedMove ?? this.getHeldMove()
    this.queuedMove = null
    if (nextMove) this.requestMove(nextMove)
  }

  private getHeldMove(): MoveIntent | null {
    if (this.keys.up.some((key) => key.isDown)) return { direction: 'up' }
    if (this.keys.down.some((key) => key.isDown)) return { direction: 'down' }
    if (this.keys.left.some((key) => key.isDown)) return { direction: 'left' }
    if (this.keys.right.some((key) => key.isDown)) return { direction: 'right' }
    return null
  }

  private interact() {
    const facingCell = addGridPoints(this.currentCell, DirectionVector[this.facing])
    const target = this.grid.getInteractionsAt(facingCell)[0] ?? this.grid.getInteractionsAt(this.currentCell)[0]
    if (!target) {
      this.showInteraction('Nothing to interact with.')
      return
    }

    this.events.emit('grid:interaction', target)
    this.showInteraction(target.interaction.message ?? target.interaction.id)
    this.followExit(target)
  }

  private followExit(target: InteractionTarget) {
    const interaction = target.interaction
    if (interaction.kind !== 'exit' || !interaction.targetMap || !interaction.targetSpawn) return
    this.scene.restart({ mapId: interaction.targetMap, spawnId: interaction.targetSpawn })
  }

  private showInteraction(message: string) {
    this.interactionTimer?.remove(false)
    this.interactionText.setText(message).setVisible(true)
    this.interactionTimer = this.time.delayedCall(2_000, () => this.interactionText.setVisible(false))
  }

  private gridToWorld({ x, y }: GridPoint) {
    return {
      x: this.worldOffset.x + x * TILE_SIZE + TILE_SIZE / 2,
      y: this.worldOffset.y + y * TILE_SIZE + TILE_SIZE / 2,
    }
  }
}
