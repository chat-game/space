import type {
  EventService,
  GameAddon,
  GameObject,
  GameObjectPlayer,
  PlayerService,
} from './types'
import { createId } from '@paralleldrive/cuid2'
import { Application, Container, TextureStyle } from 'pixi.js'
import { FlagObject } from './objects/flagObject'
import { MoveToTargetScript } from './scripts/moveToTargetScript'
import { BaseEventService } from './services/baseEventService'
import { BasePlayerService } from './services/basePlayerService'
import { getRandomInRange } from './utils/random'

interface BaseGameAddonOptions {
  id: string
  eventsUrl: string
}

export class BaseGameAddon extends Container implements GameAddon {
  id: string
  override children: GameAddon['children'] = []
  app: Application
  tick: GameAddon['tick'] = 0

  player: PlayerService
  event: EventService

  readonly #outFlags: FlagObject[] = []
  readonly #nearFlags: FlagObject[] = []

  constructor({ id, eventsUrl }: BaseGameAddonOptions) {
    super()

    this.id = id ?? createId()
    this.app = new Application()

    this.player = new BasePlayerService(this as GameAddon)
    this.event = new BaseEventService(this as GameAddon, eventsUrl)
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

    this.app.ticker.add(() => {
      this.tick = this.app.ticker.FPS

      this.player.update()
      this.#updateObjects()
      this.#removeDestroyedObjects()
    })
  }

  play() {
    // console.log('Started!')
  }

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

  get randomOutFlag(): FlagObject {
    const randomIndex = Math.floor(Math.random() * this.#outFlags.length)
    return this.#outFlags[randomIndex] as FlagObject
  }

  get randomNearFlag(): FlagObject {
    const randomIndex = Math.floor(Math.random() * this.#nearFlags.length)
    return this.#nearFlags[randomIndex] as FlagObject
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

  async handleMessage({ player, text, codename }: {
    player: {
      id: string
      name: string
    }
    text: string
    codename?: string | null
  }) {
    const playerObj = await this.player.init(player.id, player.name, codename)

    playerObj.addMessage(text)
    playerObj.updateLastActionAt()

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
