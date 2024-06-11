import type { IGameObjectUnit } from "$lib/game/types"
import { getRandomInRange } from "$lib/random"
import { createId } from "@paralleldrive/cuid2"
import type { AnimatedSprite } from "pixi.js"
import { Inventory } from "../../common"
import { DialogueInterface } from "../../components/dialogueInterface"
import type { GraphicsContainer } from "../../components/graphicsContainer"
import { UnitHairContainer } from "../../components/unitHairContainer"
import { UnitHeadContainer } from "../../components/unitHeadContainer"
import { UnitInterface } from "../../components/unitInterface"
import { UnitTopContainer } from "../../components/unitTopContainer"
import type { GameScene } from "../../scenes/gameScene"
import { AssetsManager } from "../../utils"
import { Flag } from "../flag"
import { GameObject } from "../gameObject"
import { Stone } from "../stone"
import { Tree } from "../tree"

interface IUnitOptions {
  scene: GameScene
  id?: string
  x: number
  y: number
}

export class Unit extends GameObject implements IGameObjectUnit {
  public inventory!: Inventory
  public visual!: IGameObjectUnit["visual"]
  public userName!: IGameObjectUnit["userName"]
  public coins = 0
  public dialogue!: IGameObjectUnit["dialogue"]

  private interface!: UnitInterface
  private dialogueInterface!: DialogueInterface
  children: GraphicsContainer[] = []
  private readonly animationMovingLeft!: AnimatedSprite
  private readonly animationMovingRight!: AnimatedSprite

  constructor({ scene, x, y, id }: IUnitOptions) {
    super({ scene, x, y, id })

    this.initInventory()
    this.initVisual()
    this.initDialogue()
    this.coins = 0
    this.state = "IDLE"

    this.animationMovingRight = AssetsManager.getAnimatedSpriteHero("RIGHT")
    this.animationMovingLeft = AssetsManager.getAnimatedSpriteHero("LEFT")

    this.initGraphics()
  }

  public live() {
    this.handleMessages()

    if (this.script) {
      return this.script.live()
    }
  }

  private initInventory() {
    this.inventory = new Inventory({
      objectId: this.id,
      id: createId(),
      saveInDb: false,
    })
  }

  public initVisual(visual?: IGameObjectUnit["visual"]) {
    this.visual = visual ?? {
      head: "1",
      hairstyle: "CLASSIC",
      top: "VIOLET_SHIRT",
    }
  }

  private initDialogue() {
    this.dialogue = {
      messages: [],
    }
  }

  public addMessage(message: string) {
    const MAX_CHARS = 100
    const messagePrepared =
      message.trim().slice(0, MAX_CHARS) +
      (message.length > MAX_CHARS ? "..." : "")

    this.dialogue.messages.push({
      id: createId(),
      text: messagePrepared,
    })
  }

  public handleMessages() {
    const random = getRandomInRange(1, 200)
    if (random === 1) {
      this.dialogue.messages.splice(0, 1)
    }
  }

  public chopTree() {
    if (this.target instanceof Tree && this.target.state !== "DESTROYED") {
      this.direction = "RIGHT"
      this.state = "CHOPPING"
      this.checkAndBreakTool("AXE")

      this.target.chop()
    }
  }

  public mineStone() {
    if (this.target instanceof Stone && this.target.state !== "DESTROYED") {
      this.direction = "RIGHT"
      this.state = "MINING"
      this.checkAndBreakTool("PICKAXE")

      this.target.mine()
    }
  }

  checkAndBreakTool(type: "AXE" | "PICKAXE") {
    const tool = this.inventory.items.find((item) => item.type === type)
    if (tool) {
      //this.target.health -= 0.16
      const random = getRandomInRange(1, 40)
      if (random <= 1) {
        void this.inventory.checkAndBreakItem(tool, 1)
      }
    }
  }

  private initGraphics() {
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

  public animate() {
    super.animate()

    this.zIndex = Math.round(this.y + 1)

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

    // this.interface.animate()
    // this.dialogueInterface.animate()

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

  handleSoundByState() {
    if (this.state === "CHOPPING") {
      if (this.inventory?.items.find((item) => item.type === "AXE")) {
        this.scene.game.audio.playSound("CHOP_HIT")
        return
      }

      this.scene.game.audio.playSound("HAND_HIT")
      return
    }

    if (this.state === "MINING") {
      if (this.inventory?.items.find((item) => item.type === "PICKAXE")) {
        this.scene.game.audio.playSound("MINE_HIT")
        return
      }

      this.scene.game.audio.playSound("HAND_HIT")
      return
    }
  }
}
