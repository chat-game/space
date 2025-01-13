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
import { MoveToFlagScript } from './scripts/moveToFlagScript'
import { BaseAssetService } from './services/baseAssetService'
import { BasePlayerService } from './services/basePlayerService'
import { BaseServerService } from './services/baseServerService'
import { BaseTreeService } from './services/baseTreeService'
import { BaseWebSocketService } from './services/baseWebSocketService'

interface BaseGameAddonOptions {
  websocketUrl: string
  client: GameAddon['client']
  updateUI?: () => void
}

export class BaseGameAddon extends Container implements GameAddon {
  id: string
  client: GameAddon['client']
  override children: GameAddon['children'] = []
  app: Application
  tick: GameAddon['tick'] = 0
  updateUI: () => void

  wagon: GameObjectWagon | null = null
  player: GameObjectPlayer | null = null

  assetService: BaseAssetService
  playerService: PlayerService
  treeService: TreeService
  websocketService: WebSocketService
  serverService: ServerService

  rectangle!: Rectangle
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

  constructor({ websocketUrl, client, updateUI }: BaseGameAddonOptions) {
    super()

    this.id = createId()
    this.client = client
    this.app = new Application()
    this.updateUI = updateUI || (() => {})

    this.assetService = new BaseAssetService(this as GameAddon)
    this.playerService = new BasePlayerService(this as GameAddon)
    this.treeService = new BaseTreeService(this as GameAddon)
    this.websocketService = new BaseWebSocketService(this as GameAddon, websocketUrl)
    this.serverService = new BaseServerService()
  }

  async init(telegramId: string) {
    await this.app.init({
      backgroundAlpha: 0,
      antialias: false,
      roundPixels: false,
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
    this.rectangle = new Rectangle(0, 0, this.app.screen.width, this.app.screen.height)
    this.app.stage.hitArea = this.rectangle

    this.app.stage.addChild(this)

    if (this.client === 'TELEGRAM_CLIENT') {
      this.player = await this.playerService.createPlayer({ id: createId(), telegramId, x: 200 })
      this.cameraTarget = this.player

      this.app.stage.addEventListener('pointerdown', (e) => {
        if (!this.player || !this.player.canClick) {
          return
        }

        const isTargetAnObject = e.target.children.length === 0
        if (isTargetAnObject) {
          return
        }

        const middle = this.app.screen.width / 2
        const offsetX = e.clientX - middle
        const serverX = offsetX + this.leftX

        const flag = new FlagObject({ addon: this, x: serverX, y: this.bottomY, variant: 'PLAYER_MOVEMENT' })
        if (this.player.target && this.player.target.type === 'FLAG') {
          const flag = this.player.target
          this.player.target = undefined
          flag.state = 'DESTROYED'
        }
        this.player.target = flag

        this.player.click()

        this.websocketService.send({
          type: 'NEW_PLAYER_TARGET',
          data: {
            x: serverX,
            id: this.player.id,
          },
        })
      })
    }

    this.app.ticker.add(() => {
      this.tick = this.app.ticker.FPS

      this.playerService.update()
      this.treeService.update()
      this.updateObjects()

      if (this.cameraTarget) {
        this.leftX = this.cameraTarget.x
        this.rectangle.x = this.cameraTarget.x - this.app.screen.width / 2

        this.changeCameraPosition(this.cameraTarget.x)
        this.moveCamera()
      }
    })
  }

  async play() {}

  createObject(data: { type: GameObject['type'], id: string, x: number, zIndex?: number }) {
    // Check, if already exists
    if (this.findObject(data.id)) {
      return
    }

    if (data.type === 'WAGON' && !this.wagon) {
      this.wagon = new BaseWagonObject({ addon: this, x: data.x, y: this.bottomY })
      this.app.stage.addChild(this.wagon)
      this.addChild(this.wagon)

      if (this.client === 'WAGON_CLIENT') {
        this.cameraTarget = this.wagon
      }
    }
  }

  removeObject(id: string) {
    const obj = this.findObject(id)
    if (obj) {
      if (obj.type === 'TREE') {
        this.updateUI()
      }

      const index = this.children.indexOf(obj)
      this.children.splice(index, 1)

      this.removeChild(obj)
    }
  }

  override destroy() {
    this.app.destroy()
    super.destroy()
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

  rebuildScene() {
    this.removeChild(...this.children)
    // this.app.ticker.remove()
  }

  updateObjects() {
    for (const object of this.children) {
      if (object.state === 'DESTROYED') {
        this.removeObject(object.id)
      }

      object.animate()
      object.live()

      if (object.type === 'PLAYER') {
        this.updatePlayer(object as GameObjectPlayer)
      }
    }
  }

  updatePlayer(object: GameObjectPlayer) {
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

  changeCameraPosition(x: number) {
    const columnWidth = this.app.screen.width / 8

    const leftPadding = this.client === 'TELEGRAM_CLIENT' ? 4 : 2

    this.cameraPerfectX = -x + columnWidth * leftPadding

    // If first load
    if (Math.abs(-x - this.cameraX) > 300) {
      this.cameraX = this.cameraPerfectX
    }
  }

  moveCamera() {
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
