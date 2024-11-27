import type { CharacterEditionWithCharacter } from '@chat-game/types'
import type {
  GameAddon,
  GameObject,
  GameObjectPlayer,
  PlayerService,
  ServerService,
  WebSocketService,
} from './types'
import { createId } from '@paralleldrive/cuid2'
import { Application, Container, TextureStyle } from 'pixi.js'
import { FlagObject } from './objects/flagObject'
import { TreeObject } from './objects/treeObject'
import { PlayerObject } from './objects/unit/playerObject'
import { MoveToTargetScript } from './scripts/moveToTargetScript'
import { BasePlayerService } from './services/basePlayerService'
import { BaseServerService } from './services/baseServerService'
import { BaseWebSocketService } from './services/baseWebSocketService'
import { getRandomInRange } from './utils/random'

interface BaseGameAddonOptions {
  token: string
  websocketUrl: string
}

export class BaseGameAddon extends Container implements GameAddon {
  id: string
  token: string
  override children: GameAddon['children'] = []
  app: Application
  tick: GameAddon['tick'] = 0

  playerService: PlayerService
  websocketService: WebSocketService
  serverService: ServerService

  #outFlags: FlagObject[] = []
  #nearFlags: FlagObject[] = []

  cameraOffsetX = 0
  cameraMovementSpeedX = 0.008
  cameraOffsetY = 0
  cameraMovementSpeedY = 0.008
  cameraX = 0
  cameraY = 0
  cameraPerfectX = 0
  cameraPerfectY = 0

  constructor({ token, websocketUrl }: BaseGameAddonOptions) {
    super()

    this.id = createId()
    this.token = token
    this.app = new Application()

    this.playerService = new BasePlayerService(this as GameAddon)
    this.websocketService = new BaseWebSocketService(this as GameAddon, websocketUrl)
    this.serverService = new BaseServerService()
  }

  async init() {
    await this.app.init({
      backgroundAlpha: 0,
      antialias: false,
      roundPixels: false,
      resolution: 1,
      resizeTo: window,
    })

    TextureStyle.defaultOptions.scaleMode = 'nearest'
    this.app.ticker.maxFPS = 60
    this.app.stage.y = window.innerHeight

    this.#initOutFlags()
    this.#initNearFlags()

    this.app.stage.addChild(this)

    this.app.stage.addChild(new TreeObject({ addon: this, x: 300, y: 0 }))
    this.app.stage.addChild(new TreeObject({ addon: this, x: 600, y: 0 }))

    const nick = new PlayerObject({ id: 'svhjz9p5467wne9ybasf1bwy', addon: this, x: 0, y: 0 })
    await nick.init()

    this.app.ticker.add(() => {
      this.tick = this.app.ticker.FPS

      this.playerService.update()
      this.#updateObjects()
      this.#removeDestroyedObjects()

      const target = nick
      this.changeCameraPosition(target.x)
      this.moveCamera()
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
    const offsetY = 1

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
    const offsetY = 1

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

    if (object.state === 'IDLE') {
      const random = getRandomInRange(1, 250)
      if (random <= 1) {
        const target = this.randomNearFlag

        object.script = new MoveToTargetScript({
          object,
          target,
        })
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

  changeCameraPosition(x: number) {
    const columnWidth = this.app.screen.width / 6

    const leftPadding = columnWidth * 3

    // if (wagon.speedPerSecond === 0) {
    //   leftPadding = columnWidth * 3

    //   if (wagon.state === 'IDLE' && !wagon.cargoType) {
    //     // At Village stop
    //     leftPadding = columnWidth
    //     topPadding = rowHeight * 4
    //   }
    // }

    this.cameraPerfectX = -x + leftPadding

    // If first load
    if (Math.abs(-x - this.cameraX) > 3000) {
      this.cameraX = this.cameraPerfectX
    }
  }

  moveCamera() {
    const cameraMaxSpeed = 1
    const bufferX = Math.abs(this.cameraPerfectX - this.cameraX)
    const moduleX = this.cameraPerfectX - this.cameraX > 0 ? 1 : -1
    const addToX = bufferX > cameraMaxSpeed ? cameraMaxSpeed : bufferX

    if (this.cameraX !== this.cameraPerfectX) {
      this.cameraX += addToX * moduleX
    }

    // const bufferY = Math.abs(this.cameraPerfectY - this.cameraY)
    // const moduleY = this.cameraPerfectY - this.cameraY > 0 ? 1 : -1
    // const addToY = bufferY > cameraMaxSpeed ? cameraMaxSpeed : bufferY

    // if (this.cameraY !== this.cameraPerfectY) {
    //   this.cameraY += addToY * moduleY
    // }

    // if (Math.abs(this.cameraOffsetX) >= 20) {
    //   this.cameraMovementSpeedX *= -1
    // }
    // this.cameraOffsetX += this.cameraMovementSpeedX
    //
    // if (Math.abs(this.cameraOffsetY) >= 30) {
    //   this.cameraMovementSpeedY *= -1
    // }
    // this.cameraOffsetY += this.cameraMovementSpeedY

    this.parent.x = this.cameraX
    // this.parent.y = this.cameraY
  }
}
