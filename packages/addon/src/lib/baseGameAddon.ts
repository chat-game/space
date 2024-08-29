import type { CharacterEditionWithCharacter } from '@chat-game/types'
import { createId } from '@paralleldrive/cuid2'
import { Application, Container, TextureStyle } from 'pixi.js'
import { getRandomInRange } from './utils/random'
import { FlagObject } from './objects/flagObject'
import { MoveToTargetScript } from './scripts/moveToTargetScript'
import { BasePlayerService } from './services/basePlayerService'
import { BaseServerService } from './services/baseServerService'
import { BaseWebSocketService } from './services/baseWebSocketService'
import type {
  GameAddon,
  GameObject,
  GameObjectPlayer,
  PlayerService,
  ServerService,
  WebSocketService,
} from './types'

interface BaseGameAddonOptions {
  token: string
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

  constructor({ token }: BaseGameAddonOptions) {
    super()

    this.token = token
    this.id = createId()
    this.app = new Application()

    this.playerService = new BasePlayerService(this as GameAddon)
    this.websocketService = new BaseWebSocketService(this as GameAddon, 'wss://chatgame.space/api/websocket')
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

    this.#initOutFlags()
    this.#initNearFlags()

    this.app.stage.addChild(this)

    this.playerService.init('svhjz9p5467wne9ybasf1bwy', undefined)

    this.app.ticker.add(() => {
      this.tick = this.app.ticker.FPS

      this.playerService.update()
      this.#updateObjects()
      this.#removeDestroyedObjects()
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
    const offsetY = 200

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
    const offsetY = 200

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
}
