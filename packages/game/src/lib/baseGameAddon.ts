import type { CharacterEditionWithCharacter } from '@chat-game/types'
import type {
  GameAddon,
  GameObject,
  GameObjectPlayer,
  GameObjectWagon,
  PlayerService,
  ServerService,
  TreeService,
  WebSocketService,
} from './types'
import { createId } from '@paralleldrive/cuid2'
import { Application, Container, Rectangle, TextureStyle } from 'pixi.js'
import { BaseWagonObject } from './objects/baseWagonObject'
import { FlagObject } from './objects/flagObject'
import { PlayerObject } from './objects/unit/playerObject'
import { MoveToFlagScript } from './scripts/moveToFlagScript'
import { BaseAssetService } from './services/baseAssetService'
import { BasePlayerService } from './services/basePlayerService'
import { BaseServerService } from './services/baseServerService'
import { BaseTreeService } from './services/baseTreeService'
import { BaseWebSocketService } from './services/baseWebSocketService'
import { getRandomInRange } from './utils/random'

interface BaseGameAddonOptions {
  websocketUrl: string
  client: GameAddon['client']
}

export class BaseGameAddon extends Container implements GameAddon {
  id: string
  client: GameAddon['client']
  override children: GameAddon['children'] = []
  app: Application
  tick: GameAddon['tick'] = 0

  wagon: GameObjectWagon

  assetService: BaseAssetService
  playerService: PlayerService
  treeService: TreeService
  websocketService: WebSocketService
  serverService: ServerService

  #outFlags: FlagObject[] = []
  #nearFlags: FlagObject[] = []

  bottomY = 0
  leftX = 0
  cameraTarget: GameObjectWagon | GameObjectPlayer | null = null
  cameraOffsetX = 0
  cameraMovementSpeedX = 0.008
  cameraOffsetY = 0
  cameraMovementSpeedY = 0.008
  cameraX = 0
  cameraY = 0
  cameraPerfectX = 0
  cameraPerfectY = 0

  constructor({ websocketUrl, client }: BaseGameAddonOptions) {
    super()

    this.id = createId()
    this.client = client
    this.app = new Application()

    this.assetService = new BaseAssetService(this as GameAddon)
    this.playerService = new BasePlayerService(this as GameAddon)
    this.treeService = new BaseTreeService(this as GameAddon)
    this.websocketService = new BaseWebSocketService(this as GameAddon, websocketUrl)
    this.serverService = new BaseServerService()

    this.wagon = new BaseWagonObject({ addon: this, x: 300, y: this.bottomY })
    this.app.stage.addChild(this.wagon)
    this.addChild(this.wagon)
  }

  async init() {
    await this.app.init({
      backgroundAlpha: 0,
      antialias: true,
      roundPixels: true,
      resolution: 1,
      resizeTo: window,
    })

    await this.assetService.load()

    TextureStyle.defaultOptions.scaleMode = 'nearest'
    this.app.ticker.maxFPS = 60
    this.bottomY = this.app.screen.height - 100

    this.app.stage.eventMode = 'static'
    this.app.screen.width = window.innerWidth
    this.app.screen.height = window.innerHeight
    const rectangle = new Rectangle(0, 0, this.app.screen.width, this.app.screen.height)
    this.app.stage.hitArea = rectangle

    this.#initOutFlags()
    this.#initNearFlags()

    this.app.stage.addChild(this)

    const nick = new PlayerObject({ id: 'svhjz9p5467wne9ybasf1bwy', addon: this, x: 500, y: this.bottomY })
    await nick.init()

    if (this.client === 'TELEGRAM_CLIENT') {
      this.cameraTarget = nick
    }
    if (this.client === 'WAGON_CLIENT') {
      this.cameraTarget = this.wagon
    }

    this.app.stage.addEventListener('pointerdown', (e) => {
      const middle = this.app.screen.width / 2
      const offsetX = e.clientX - middle
      const serverX = offsetX + this.leftX

      const flag = new FlagObject({ addon: this, x: serverX, y: this.bottomY, variant: 'PLAYER_MOVEMENT' })
      if (nick.target && nick.target.type === 'FLAG') {
        const flag = nick.target
        nick.target = undefined
        flag.state = 'DESTROYED'
      }
      nick.target = flag
    })

    this.treeService.init()

    this.app.ticker.add(() => {
      this.leftX = nick.x
      this.tick = this.app.ticker.FPS

      this.playerService.update()
      this.treeService.update()
      this.#updateObjects()
      this.#removeDestroyedObjects()

      this.#changeCameraPosition(this.cameraTarget ? this.cameraTarget.x : 0)
      this.#moveCamera()
      rectangle.x = nick.x - this.app.screen.width / 2
    })
  }

  async play() {}

  override destroy() {
    this.app.destroy()
    super.destroy()
  }

  removeObject(obj: GameObject) {
    this.removeChild(obj)
  }

  checkIfThisFlagIsTarget(id: string): boolean {
    for (const obj of this.children) {
      if (obj.target?.id === id) {
        return true
      }
    }
    return false
  }

  findObject(id: string): GameObject | undefined {
    return this.children.find((obj) => obj.id === id)
  }

  rebuildScene(): void {
    this.removeChild(...this.children)
  }

  get randomOutFlag() {
    return this.#outFlags[Math.floor(Math.random() * this.#outFlags.length)] as FlagObject
  }

  get randomNearFlag() {
    return this.#nearFlags[Math.floor(Math.random() * this.#nearFlags.length)] as FlagObject
  }

  #initOutFlags(count = 1) {
    for (let i = 0; i < count; i++) {
      this.#outFlags.push(this.#generateRandomOutFlag())
    }
  }

  #initNearFlags(count = 20) {
    for (let i = 0; i < count; i++) {
      this.#nearFlags.push(this.#generateRandomNearFlag())
    }
  }

  #generateRandomOutFlag() {
    const offsetX = -240
    const offsetY = this.bottomY

    const flag = new FlagObject({
      addon: this as GameAddon,
      variant: 'OUT_OF_SCREEN',
      x: offsetX,
      y: offsetY,
    })

    return flag
  }

  #generateRandomNearFlag() {
    const offsetX = getRandomInRange(0, this.app.screen.width)
    const offsetY = this.bottomY

    const flag = new FlagObject({
      addon: this as GameAddon,
      variant: 'MOVEMENT',
      x: offsetX,
      y: offsetY,
    })

    return flag
  }

  async handleMessage({ playerId, text, character }: {
    playerId: string
    text: string
    character?: CharacterEditionWithCharacter
  }) {
    const player = await this.playerService.init(playerId, character)

    player.addMessage(text)
    player.updateLastActionAt()

    return { ok: true, message: null }
  }

  #updateObjects() {
    for (const object of this.children) {
      object.animate()
      object.live()

      if (object.type === 'PLAYER') {
        this.#updatePlayer(object as GameObjectPlayer)
      }
    }
  }

  #updatePlayer(object: GameObjectPlayer) {
    if (object.script) {
      return
    }

    if (object.target && object.target.type === 'FLAG') {
      object.script = new MoveToFlagScript({
        object,
        target: object.target,
      })
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

  #changeCameraPosition(x: number) {
    const columnWidth = this.app.screen.width / 6

    const leftPadding = this.client === 'TELEGRAM_CLIENT' ? 3 : 1

    this.cameraPerfectX = -x + columnWidth * leftPadding

    // If first load
    if (Math.abs(-x - this.cameraX) > 300) {
      this.cameraX = this.cameraPerfectX
    }
  }

  #moveCamera() {
    const cameraMaxSpeed = 2
    const bufferX = Math.abs(this.cameraPerfectX - this.cameraX)
    const moduleX = this.cameraPerfectX - this.cameraX > 0 ? 1 : -1
    const addToX = bufferX > cameraMaxSpeed ? cameraMaxSpeed : bufferX

    if (this.cameraX !== this.cameraPerfectX) {
      this.cameraX += addToX * moduleX
    }

    this.parent.x = this.cameraX
  }
}
