import { Application, Container } from 'pixi.js'
import { createId } from '@paralleldrive/cuid2'
import { gameOptions } from '../store.svelte'
import { ServerService } from '../services/server/serverService'
import { BaseWagon } from '../objects/baseWagon'
import { FlagObject } from '../objects/flagObject'
import { ANSWER } from '../services/action/answer'
import { Player } from '../objects/units/player'
import { MoveOffScreenAndSelfDestroyScript } from '../scripts/moveOffScreenAndSelfDestroyScript'
import { CustomWebSocketService } from './customWebSocketService'
import type {
  Game,
  GameObject,
  GameObjectPlayer,
  GameOptions,
  IGameActionResponse,
  UnitsOnStream,
} from '$lib/game/types'
import { AssetsManager } from '$lib/game/utils/assetsManager'
import { getRandomInRange } from '$lib/utils/random'
import { MoveToTargetScript } from '$lib/game/scripts/moveToTargetScript'
import { EventService } from '$lib/game/services/event/eventService'
import { Group } from '$lib/game/common/group'
import { PlayerService } from '$lib/game/services/player/playerService'
import type { Wagon } from '$lib/game/services/wagon/interface'
import { getDateMinusMinutes } from '$lib/utils/date'

interface UnitsOnStreamPluginOptions {
  isSocketOn?: boolean
}

export class UnitsOnStreamPlugin extends Container implements UnitsOnStream {
  id: string
  profileJWT?: string
  options: GameOptions
  children: Game['children'] = []
  app: Application
  scene!: Game['scene']
  tick: Game['tick'] = 0
  group: Group
  wagon!: BaseWagon

  eventService: EventService
  playerService: PlayerService
  websocketService: CustomWebSocketService
  serverService: ServerService

  #outFlags: FlagObject[] = []
  #nearFlags: FlagObject[] = []

  #cameraX = 0
  #cameraY = 0
  #cameraPerfectX = 0
  #cameraPerfectY = 0

  constructor({ isSocketOn }: UnitsOnStreamPluginOptions) {
    super()

    this.options = gameOptions
    this.options.isSocketOn = isSocketOn ?? false

    this.id = createId()
    this.app = new Application()
    this.group = new Group()

    this.eventService = new EventService(this as any)
    this.playerService = new PlayerService(this as any)
    this.websocketService = new CustomWebSocketService(this)
    this.serverService = new ServerService(this as any)
  }

  async init() {
    await this.app.init({
      backgroundAlpha: 0,
      antialias: false,
      roundPixels: false,
      resolution: 1,
      resizeTo: window,
    })

    await AssetsManager.init()

    // this.audio.playSound("FOREST_BACKGROUND")

    this.#initWagon({ x: 1, y: 1 })

    this.app.stage.addChild(this)

    // this.initScene('MOVING')

    this.app.ticker.add(() => {
      if (this.options.isPaused) {
        return
      }

      this.tick = this.app.ticker.FPS

      this.eventService.update()
      // this.wagonService.update()
      this.#removeInactivePlayers()
      this.#updateObjects()
      this.#removeDestroyedObjects()

      this.#changeCameraPosition(this.wagon)
      this.#moveCamera()
    })
  }

  async play() {
    this.options.isPaused = false

    // setInterval(() => {
    //   console.log("FPS", this.app.ticker.FPS)
    //   console.log("Objects", this.children.length)
    // }, 1000)
  }

  destroy() {
    this.app.destroy()

    super.destroy()
  }

  removeObject(obj: GameObject) {
    this.removeChild(obj)
  }

  get activePlayers() {
    return this.children.filter((obj) => obj.type === 'PLAYER') as GameObjectPlayer[]
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
    return this.#outFlags[Math.floor(Math.random() * this.#outFlags.length)]
  }

  get randomNearFlag() {
    return this.#nearFlags[Math.floor(Math.random() * this.#nearFlags.length)]
  }

  #initWagon({ x, y }: { x: number, y: number }) {
    this.wagon = new BaseWagon({ game: this as any, x, y })
    this.wagon.init()

    this.#initOutFlags()
    this.#initNearFlags()
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
    const offsetX = -500
    const offsetY = 30

    const flag = new FlagObject({
      game: this as any,
      variant: 'OUT_OF_SCREEN',
      x: this.wagon.x + offsetX,
      y: this.wagon.y + offsetY,
      offsetX,
      offsetY,
    })

    return flag
  }

  #generateRandomNearFlag() {
    const minOffsetX = 200

    const offsetX
      = getRandomInRange(minOffsetX, this.app.screen.width - 500)
    const offsetY = 30

    const flag = new FlagObject({
      game: this as any,
      variant: 'WAGON_NEAR_MOVEMENT',
      x: this.wagon.x + offsetX,
      y: this.wagon.y + offsetY,
      offsetX,
      offsetY,
    })

    return flag
  }

  async handleMessage({ playerId, text }: { playerId: string, text: string }): Promise<IGameActionResponse> {
    const player = await this.#initPlayer(playerId)
    if (!player) {
      return ANSWER.NO_PLAYER_ERROR
    }

    return this.#handleMessage(player, text)
  }

  async #initPlayer(id: string) {
    const player = await this.findOrCreatePlayer(id)
    if (!player) {
      return
    }

    this.group.join(player)
    this.addChild(player)
    player.updateLastActionAt()

    return player
  }

  async findOrCreatePlayer(id: string): Promise<Player> {
    const player = this.#findPlayer(id)
    if (!player) {
      return this.#createPlayer(id)
    }

    return player
  }

  #findPlayer(id: string) {
    return this.children.find((p) => p.id === id && p.type === 'PLAYER') as Player | undefined
  }

  async #createPlayer(id: string) {
    const player = new Player({ game: this as any, id, x: -100, y: -100 })
    await player.init()

    const flag = this.randomOutFlag
    player.x = flag.x
    player.y = flag.y

    return player
  }

  #removeInactivePlayers() {
    for (const player of this.activePlayers) {
      const checkTime = getDateMinusMinutes(4)
      if (player.lastActionAt.getTime() <= checkTime.getTime()) {
        if (player.script) {
          continue
        }

        const target = this.randomOutFlag
        const selfDestroyFunc = () => {
          this.group.remove(player)
          player.state = 'DESTROYED'
        }

        player.script = new MoveOffScreenAndSelfDestroyScript({
          target,
          object: player,
          selfDestroyFunc,
        })
      }
    }
  }

  async #handleMessage(player: GameObjectPlayer, text: string): Promise<IGameActionResponse> {
    player.addMessage(text)
    player.updateLastActionAt()

    return ANSWER.OK
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
      const random = getRandomInRange(1, 150)
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

  #changeCameraPosition(wagon: Wagon) {
    const columnWidth = this.app.screen.width / 8
    const rowHeight = this.app.screen.height / 8

    const leftPadding = columnWidth - 20
    const topPadding = rowHeight * 7 - 5

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
    const cameraSpeedPerSecond = 25
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
