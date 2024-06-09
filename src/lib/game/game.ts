import { Application, Container } from "pixi.js"
import type {
  IGameObject,
  IGameObjectMechanic,
  IGameObjectPlayer,
  IGameObjectRaider,
  IGameObjectTrader,
  WebSocketMessage,
  GameSceneType,
} from "$lib/game/types"
import { type GameObject, type Wagon } from "./objects"
import { Mechanic, Player, Raider, Trader } from "./objects/units"
import type { GameScene } from "./scenes/gameScene"
import { MovingScene } from "./scenes/movingScene"
import { AssetsManager, AudioManager } from "./utils"
import { BackgroundGenerator } from "./utils/generators/background"

export class Game extends Container {
  public children: GameObject[] = []
  public app!: Application
  public audio!: AudioManager
  public scene!: GameScene
  public bg!: BackgroundGenerator

  public tick = 0
  public cameraOffsetX = 0
  public cameraMovementSpeedX = 0.008
  public cameraOffsetY = 0
  public cameraMovementSpeedY = 0.008
  public cameraX = 0
  public cameraY = 0
  public cameraPerfectX = 0
  public cameraPerfectY = 0

  constructor() {
    super()

    this.app = new Application()
    this.audio = new AudioManager()
    this.bg = new BackgroundGenerator(this.app)
  }

  public async init() {
    await this.app.init({
      background: "#239063",
      antialias: false,
      roundPixels: false,
      resolution: 1,
    })

    await AssetsManager.init()

    // this.audio.playSound("FOREST_BACKGROUND")

    //const bg = this.bg.getGeneratedBackgroundTilingSprite()
    //bg.width = 10000
    //bg.height = 10000
    //this.app.stage.addChild(bg)

    this.app.stage.addChild(this)

    // WebSocketManager.init(this)

    this.scene = new MovingScene({ game: this })

    this.app.ticker.add(() => {
      this.tick = this.app.ticker.FPS

      this.scene.live()

      this.animateObjects()
      this.removeDestroyedObjects()

      const wagon = this.scene.wagonService.wagon
      this.changeCameraPosition(wagon)

      this.moveCamera()
    })
  }

  public async play() {
    this.audio.isEnabled = true;

    // setInterval(() => {
    //   console.log("FPS", this.app.ticker.FPS)
    //   console.log("Objects", this.children.length)
    // }, 1000)
  }

  public destroy() {
    this.audio.destroy()
    this.app.destroy()

    super.destroy();
  }

  private changeCameraPosition(wagon: Wagon) {
    const columnWidth = this.app.screen.width / 6
    const rowHeight = this.app.screen.height / 6

    let leftPadding =
      wagon.direction === "LEFT" ? columnWidth * 4 : columnWidth * 2
    let topPadding = rowHeight * 3

    if (wagon.speedPerSecond === 0) {
      leftPadding = columnWidth * 3

      if (wagon.state === "IDLE" && !wagon.cargoType) {
        // At Village stop
        leftPadding = columnWidth
        topPadding = rowHeight * 4
      }
    }

    this.cameraPerfectX = -wagon.x + leftPadding
    this.cameraPerfectY = -wagon.y + topPadding

    // If first load
    if (Math.abs(-wagon.x - this.cameraX) > 3000) {
      this.cameraX = this.cameraPerfectX
    }
    if (Math.abs(-wagon.y - this.cameraY) > 3000) {
      this.cameraY = this.cameraPerfectY
    }
  }

  private moveCamera() {
    const cameraMaxSpeed = 0.2
    const bufferX = Math.abs(this.cameraPerfectX - this.cameraX)
    const moduleX = this.cameraPerfectX - this.cameraX > 0 ? 1 : -1
    const addToX = bufferX > cameraMaxSpeed ? cameraMaxSpeed : bufferX

    if (this.cameraX !== this.cameraPerfectX) {
      this.cameraX += addToX * moduleX
    }

    const bufferY = Math.abs(this.cameraPerfectY - this.cameraY)
    const moduleY = this.cameraPerfectY - this.cameraY > 0 ? 1 : -1
    const addToY = bufferY > cameraMaxSpeed ? cameraMaxSpeed : bufferY

    if (this.cameraY !== this.cameraPerfectY) {
      this.cameraY += addToY * moduleY
    }

    // if (Math.abs(this.cameraOffsetX) >= 20) {
    //   this.cameraMovementSpeedX *= -1
    // }
    // this.cameraOffsetX += this.cameraMovementSpeedX
    //
    // if (Math.abs(this.cameraOffsetY) >= 30) {
    //   this.cameraMovementSpeedY *= -1
    // }
    // this.cameraOffsetY += this.cameraMovementSpeedY

    if (this.parent) {
      this.parent.x = this.cameraX
      this.parent.y = this.cameraY
    }
  }

  rebuildScene() {
    this.removeChild(...this.children)
  }

  findObject(id: string) {
    return this.children.find((obj) => obj.id === id)
  }

  public initScene(scene: GameSceneType) {
    if (this.scene) {
      this.scene.destroy()
    }

    if (scene === "MOVING") {
      this.scene = new MovingScene({ game: this })
      return
    }
  }

  initPlayer(object: IGameObjectPlayer) {
    const player = new Player({ game: this, object })
    this.addChild(player)
  }

  updatePlayer(object: IGameObjectPlayer) {
    const player = this.findObject(object.id)
    if (player instanceof Player) {
      player.update(object)
    }
  }

  initTrader(object: IGameObjectTrader) {
    const unit = new Trader({ game: this, object })
    this.addChild(unit)
  }

  updateTrader(object: IGameObjectTrader) {
    const unit = this.findObject(object.id)
    if (unit instanceof Trader) {
      unit.update(object)
    }
  }

  initMechanic(object: IGameObjectMechanic) {
    const unit = new Mechanic({ game: this, object })
    this.addChild(unit)
  }

  updateMechanic(object: IGameObjectMechanic) {
    const unit = this.findObject(object.id)
    if (unit instanceof Mechanic) {
      unit.update(object)
    }
  }

  initRaider(object: IGameObjectRaider) {
    const raider = new Raider({ game: this, object })
    this.addChild(raider)
  }

  updateRaider(object: IGameObjectRaider) {
    const raider = this.findObject(object.id)
    if (raider instanceof Raider) {
      raider.update(object)
    }
  }

  public checkIfThisFlagIsTarget(id: string) {
    for (const obj of this.children) {
      if (obj.target?.id === id) {
        return true
      }
    }
  }

  animateObjects() {
    for (const object of this.children) {
      object?.animate()
      object?.live()
    }
  }

  removeDestroyedObjects() {
    for (const object of this.children) {
      if (object.state === "DESTROYED") {
        const index = this.children.indexOf(object)
        this.children.splice(index, 1)
        return
      }
    }
  }

  handleMessage(message: WebSocketMessage) {
    if (message.object) {
      this.handleMessageObject(message.object)
    }
    if (message.event) {
      this.handleMessageEvent(message.event)
    }
  }

  handleMessageObject(object: Partial<IGameObject>) {
    if (!object.id) {
      return
    }

    const obj = this.findObject(object.id)
    if (!obj) {
      if (object.entity === "PLAYER") {
        this.initPlayer(object as IGameObjectPlayer)
        return
      }
      if (object.entity === "TRADER") {
        this.initTrader(object as IGameObjectTrader)
        return
      }
      if (object.entity === "MECHANIC") {
        this.initMechanic(object as IGameObjectMechanic)
        return
      }
      if (object.entity === "RAIDER") {
        this.initRaider(object as IGameObjectRaider)
        return
      }
      return
    }

    if (object.entity === "PLAYER") {
      this.updatePlayer(object as IGameObjectPlayer)
      return
    }
    if (object.entity === "TRADER") {
      this.updateTrader(object as IGameObjectTrader)
      return
    }
    if (object.entity === "MECHANIC") {
      this.updateMechanic(object as IGameObjectMechanic)
      return
    }
    if (object.entity === "RAIDER") {
      this.updateRaider(object as IGameObjectRaider)
      return
    }
  }

  handleMessageEvent(event: WebSocketMessage["event"]) {
    if (event === "RAID_STARTED") {
      this.audio.playSound("MARCHING_WITH_HORNS")
    }
    if (event === "GROUP_FORM_STARTED") {
      this.audio.playSound("MARCHING_WITH_HORNS")
    }
    if (event === "MAIN_QUEST_STARTED") {
      this.audio.playSound("MARCHING_WITH_HORNS")
    }
    if (event === "SCENE_CHANGED") {
      this.rebuildScene()
    }
    if (event === "IDEA_CREATED") {
      this.audio.playSound("YEAH")
    }
  }
}
