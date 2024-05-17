import type { AnimatedSprite } from "pixi.js"
import type {
  IGameInventory,
  IGameObjectUnit,
} from "../../../../../../packages/api-sdk/src"
import { DialogueInterface } from "../../components/dialogueInterface"
import type { GraphicsContainer } from "../../components/graphicsContainer"
import { UnitHairContainer } from "../../components/unitHairContainer"
import { UnitHeadContainer } from "../../components/unitHeadContainer"
import { UnitInterface } from "../../components/unitInterface"
import { UnitTopContainer } from "../../components/unitTopContainer"
import type { Game } from "../../game"
import { AssetsManager } from "../../utils"
import { Flag } from "../flag"
import { GameObjectContainer } from "../gameObjectContainer"

interface IUnitOptions {
  game: Game
  object: IGameObjectUnit
}

export class Unit extends GameObjectContainer implements IGameObjectUnit {
  public inventory!: IGameInventory
  public visual!: IGameObjectUnit["visual"]
  public userName!: IGameObjectUnit["userName"]
  public coins = 0
  public dialogue!: IGameObjectUnit["dialogue"]

  public interface!: UnitInterface
  public dialogueInterface!: DialogueInterface
  public children: GraphicsContainer[] = []
  animationMovingLeft!: AnimatedSprite
  animationMovingRight!: AnimatedSprite

  constructor({ game, object }: IUnitOptions) {
    super({ game, ...object })
    this.update(object)

    this.animationMovingRight = AssetsManager.getAnimatedSpriteHero("RIGHT")
    this.animationMovingLeft = AssetsManager.getAnimatedSpriteHero("LEFT")

    this.init()
  }

  init() {
    const top = this.initTop()
    const head = this.initHead()
    const hair = this.initHair()

    this.initInterface()

    this.addChild(
      ...top,
      ...head,
      ...hair,
      this.animationMovingLeft,
      this.animationMovingRight,
      this.interface,
      this.dialogueInterface,
    )
  }

  initTop() {
    return UnitTopContainer.getAll()
  }

  initHead() {
    return UnitHeadContainer.getAll()
  }

  initHair() {
    return UnitHairContainer.getAll()
  }

  initInterface() {
    this.interface = new UnitInterface(this)
    this.dialogueInterface = new DialogueInterface(this)
  }

  animate() {
    for (const container of this.children) {
      container.visible = false

      if (this.state === "MOVING") {
        this.animationMovingLeft.animationSpeed = 0.25
        this.animationMovingRight.animationSpeed = 0.25

        if (this.direction === "RIGHT") {
          this.animationMovingRight.visible = true
          this.animationMovingRight.play()
        }
        if (this.direction === "LEFT") {
          this.animationMovingLeft.visible = true
          this.animationMovingLeft.play()
        }
      }

      if (
        this.state === "IDLE" ||
        this.state === "CHOPPING" ||
        this.state === "MINING"
      ) {
        this.animationMovingLeft.animationSpeed = 0
        this.animationMovingRight.animationSpeed = 0
        this.animationMovingLeft.currentFrame = 0
        this.animationMovingRight.currentFrame = 0

        if (this.direction === "LEFT") {
          this.animationMovingLeft.visible = true
        }
        if (this.direction === "RIGHT") {
          this.animationMovingRight.visible = true
        }
      }

      this.drawTop(container)
      this.drawHead(container)
      this.drawHair(container)
    }

    this.interface.animate()
    this.dialogueInterface.animate()

    this.showToolInHand()
    this.handleSoundByState()

    if (this.target && this.target instanceof Flag) {
      this.target.visible = true
    }
  }

  drawTop(container: GraphicsContainer) {
    if (container instanceof UnitTopContainer) {
      if (container.visual !== this.visual.top) {
        return
      }
      if (container.direction !== this.direction) {
        return
      }

      container.visible = true
    }
  }

  drawHead(container: GraphicsContainer) {
    if (container instanceof UnitHeadContainer) {
      if (container.visual !== this.visual.head) {
        return
      }
      if (container.direction !== this.direction) {
        return
      }

      container.visible = true
    }
  }

  drawHair(container: GraphicsContainer) {
    if (container instanceof UnitHairContainer) {
      if (container.visual !== this.visual.hairstyle) {
        return
      }
      if (container.direction !== this.direction) {
        return
      }

      container.visible = true
    }
  }

  showToolInHand() {
    if (this.state === "CHOPPING") {
      this.interface.showAxeInHand()
    }
    if (this.state === "MINING") {
      this.interface.showPickaxeInHand()
    }
  }

  update(object: IGameObjectUnit) {
    super.update(object)

    this.zIndex = Math.round(object.y + 1)

    this.userName = object.userName
    this.inventory = object.inventory
    this.visual = object.visual
    this.coins = object.coins
    this.speed = object.speed
    this.dialogue = object.dialogue
  }

  handleSoundByState() {
    if (this.state === "CHOPPING") {
      if (this.inventory?.items.find((item) => item.type === "AXE")) {
        this.game.audio.playChopWithAxeSound()
        return
      }

      this.game.audio.playHandPunch()
      return
    }

    if (this.state === "MINING") {
      if (this.inventory?.items.find((item) => item.type === "PICKAXE")) {
        this.game.audio.playMineWithPickaxeSound()
        return
      }

      this.game.audio.playHandPunch()
      return
    }
  }
}
