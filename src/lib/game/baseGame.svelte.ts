import { Application, Container } from 'pixi.js'
import { createId } from '@paralleldrive/cuid2'
import type {
  Game,
  GameObject,
  GameObjectPlayer,
  GameSceneType,
  GameStateResponse,
  IGameInventoryItem, IGameObjectRaider,
} from '$lib/game/types'
import { AudioManager } from '$lib/game/utils/audioManager'
import { BackgroundGenerator } from '$lib/game/utils/generators/background'
import { AssetsManager } from '$lib/game/utils/assetsManager'
import { MovingScene } from '$lib/game/scenes/movingScene'
import {
  MoveOffScreenAndSelfDestroyScript,
} from '$lib/game/scripts/moveOffScreenAndSelfDestroyScript'
import { getRandomInRange } from '$lib/utils/random'
import { MoveToTargetScript } from '$lib/game/scripts/moveToTargetScript'
import { ChopTreeScript } from '$lib/game/scripts/chopTreeScript'
import { ActionService } from '$lib/game/services/action/actionService'
import { EventService } from '$lib/game/services/event/eventService'
import { TradeService } from '$lib/game/services/trade/tradeService'
import { WagonService } from '$lib/game/services/wagon/wagonService'
import { RouteService } from '$lib/game/services/route/routeService'
import { ChunkService } from '$lib/game/services/chunk/chunkService'
import { TreeObject } from '$lib/game/objects/treeObject'
import { Group } from '$lib/game/common/group'
import { PlayerService } from '$lib/game/services/player/playerService'
import { Raider } from '$lib/game/objects/units/raider'
import { QuestService } from '$lib/game/services/quest/questService'
import type { Wagon } from '$lib/game/services/wagon/interface'

export class BaseGame extends Container implements Game {
  id: string
  isPaused = $state(false)
  children: Game['children'] = []
  app: Application
  audio: Game['audio']
  scene!: Game['scene']
  bg!: BackgroundGenerator
  tick: Game['tick'] = 0
  group: Group

  actionService: ActionService
  eventService: EventService
  tradeService: TradeService
  wagonService: WagonService
  routeService: RouteService
  chunkService: ChunkService
  playerService: PlayerService
  questService: QuestService

  #cameraX = 0
  #cameraY = 0
  #cameraPerfectX = 0
  #cameraPerfectY = 0

  constructor() {
    super()

    this.id = createId()
    this.app = new Application()
    this.audio = new AudioManager()
    this.bg = new BackgroundGenerator(this.app)
    this.group = new Group()

    this.actionService = new ActionService(this)
    this.eventService = new EventService(this)
    this.tradeService = new TradeService(this)
    this.wagonService = new WagonService(this)
    this.routeService = new RouteService(this)
    this.chunkService = new ChunkService(this)
    this.playerService = new PlayerService(this)
    this.questService = new QuestService(this)
  }

  async init() {
    await this.app.init({
      background: '#239063',
      antialias: false,
      roundPixels: false,
      resolution: 1,
    })

    await AssetsManager.init()

    // this.audio.playSound("FOREST_BACKGROUND")

    // const bg = this.bg.getGeneratedBackgroundTilingSprite()
    // bg.width = 10000
    // bg.height = 10000
    // this.app.stage.addChild(bg)

    this.app.stage.addChild(this)

    this.initScene('MOVING')

    this.app.ticker.add(() => {
      if (this.isPaused) {
        return
      }

      this.tick = this.app.ticker.FPS

      this.eventService.update()
      this.tradeService.update()
      this.wagonService.update()
      this.routeService.update()
      this.chunkService.update()
      this.playerService.update()
      this.questService.update()
      this.#updateObjects()
      this.#removeDestroyedObjects()

      const wagon = this.wagonService.wagon
      this.#changeCameraPosition(wagon)
      this.#moveCamera()
    })
  }

  async play() {
    this.audio.isEnabled = true
    this.isPaused = false

    // setInterval(() => {
    //   console.log("FPS", this.app.ticker.FPS)
    //   console.log("Objects", this.children.length)
    // }, 1000)
  }

  destroy() {
    this.audio.destroy()
    this.app.destroy()

    super.destroy()
  }

  removeObject(obj: GameObject) {
    this.removeChild(obj)
  }

  initScene(scene: GameSceneType) {
    if (this.scene) {
      this.scene.destroy()
    }

    if (scene === 'MOVING') {
      this.scene = new MovingScene({ game: this })
    }
  }

  get activePlayers() {
    return this.children.filter((obj) => obj.type === 'PLAYER') as GameObjectPlayer[]
  }

  getWarehouseItems(): IGameInventoryItem[] | undefined {
    const warehouse = this.chunkService.chunk?.warehouse
    if (warehouse) {
      return warehouse.inventory.items
    }

    return undefined
  }

  checkIfThisFlagIsTarget(id: string): boolean {
    for (const obj of this.children) {
      if (obj.target?.id === id) {
        return true
      }
    }
    return false
  }

  initRaiders(count: number) {
    for (let i = 0; i < count; i++) {
      const flag = this.wagonService.randomOutFlag

      new Raider({ game: this, x: flag.x, y: flag.y }).init()
    }
  }

  stopRaid() {
    for (const object of this.children) {
      if (object instanceof Raider) {
        const target = this.wagonService.randomOutFlag
        const selfDestroyFunc = () => {
          this.removeObject(object)
        }

        object.script = new MoveOffScreenAndSelfDestroyScript({
          target,
          object,
          selfDestroyFunc,
        })
      }
    }
  }

  findObject(id: string): GameObject | undefined {
    return this.children.find((obj) => obj.id === id)
  }

  getState(): GameStateResponse {
    return {
      id: this.id,
      commands: this.actionService.getAvailableCommands(),
      events: this.eventService.events,
      group: this.group.getGroup(),
      wagon: this.wagonService.wagon,
      chunk: this.chunkService.chunk,
      route: this.routeService.getRoute(),
      warehouseItems: this.getWarehouseItems(),
    }
  }

  rebuildScene(): void {
    this.removeChild(...this.children)
  }

  #updateObjects() {
    for (const object of this.children) {
      object.animate()
      object.live()

      if (object.type === 'PLAYER') {
        this.#updatePlayer(object as GameObjectPlayer)
      }
      if (object.type === 'RAIDER') {
        this.#updateRaider(object as IGameObjectRaider)
      }
    }
  }

  #updatePlayer(object: GameObjectPlayer) {
    if (object.script) {
      return
    }

    if (object.state === 'IDLE') {
      const random = getRandomInRange(1, 150)
      if (random <= 1) {
        const target = this.wagonService.randomNearFlag

        object.script = new MoveToTargetScript({
          object,
          target,
        })
      }
    }
  }

  #updateRaider(object: IGameObjectRaider) {
    if (object.script) {
      return
    }

    // If there is an available tree
    const availableTree = this.chunkService.chunk?.availableTree
    if (availableTree) {
      const chopTreeFunc = (): boolean => {
        object.chopTree()
        if (!object.target || object.target.state === 'DESTROYED') {
          object.state = 'IDLE'
          if (object.target instanceof TreeObject) {
            void object.inventory.addOrCreateItem(
              'WOOD',
              object.target?.resource,
            )
          }
          return true
        }
        return false
      }

      object.script = new ChopTreeScript({
        object,
        target: availableTree,
        chopTreeFunc,
      })

      return
    }

    if (object.state === 'IDLE') {
      const random = getRandomInRange(1, 100)
      if (random <= 1) {
        const randomObj = this.chunkService.chunk?.randomMovementFlag
        if (!randomObj) {
          return
        }
        object.setTarget(randomObj)
      }
    }
  }

  #removeDestroyedObjects() {
    for (const object of this.children) {
      if (object.state === 'DESTROYED') {
        const index = this.children.indexOf(object)
        this.children.splice(index, 1)
        return
      }
    }
  }

  #changeCameraPosition(wagon: Wagon) {
    const columnWidth = this.app.screen.width / 6
    const rowHeight = this.app.screen.height / 6

    let leftPadding
      = wagon.direction === 'LEFT' ? columnWidth * 4 : columnWidth * 2
    let topPadding = rowHeight * 3

    if (wagon.speedPerSecond === 0) {
      leftPadding = columnWidth * 3

      if (wagon.state === 'IDLE' && !wagon.cargoType) {
        // At Village stop
        leftPadding = columnWidth
        topPadding = rowHeight * 4
      }
    }

    this.#cameraPerfectX = -wagon.x + leftPadding
    this.#cameraPerfectY = -wagon.y + topPadding

    // If first load
    if (Math.abs(-wagon.x - this.#cameraX) > 3000) {
      this.#cameraX = this.#cameraPerfectX
    }
    if (Math.abs(-wagon.y - this.#cameraY) > 3000) {
      this.#cameraY = this.#cameraPerfectY
    }
  }

  #moveCamera() {
    const cameraSpeedPerSecond = 18
    const cameraDistance = cameraSpeedPerSecond / this.tick

    const bufferX = Math.abs(this.#cameraPerfectX - this.#cameraX)
    const moduleX = this.#cameraPerfectX - this.#cameraX > 0 ? 1 : -1
    const addToX = bufferX > cameraDistance ? cameraDistance : bufferX

    if (this.#cameraX !== this.#cameraPerfectX) {
      this.#cameraX += addToX * moduleX
    }

    const bufferY = Math.abs(this.#cameraPerfectY - this.#cameraY)
    const moduleY = this.#cameraPerfectY - this.#cameraY > 0 ? 1 : -1
    const addToY = bufferY > cameraDistance ? cameraDistance : bufferY

    if (this.#cameraY !== this.#cameraPerfectY) {
      this.#cameraY += addToY * moduleY
    }

    if (this.parent) {
      this.parent.x = this.#cameraX
      this.parent.y = this.#cameraY
    }
  }
}
