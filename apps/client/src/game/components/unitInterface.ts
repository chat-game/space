import { Graphics, Sprite, Text } from "pixi.js"
import type { IGameObjectUnit } from "../../../../../packages/api-sdk/src"
import { GraphicsContainer } from "./graphicsContainer"

export class UnitInterface extends GraphicsContainer {
  public children: GraphicsContainer[] = []
  public unit: IGameObjectUnit

  public userName = ""
  public coins = 0
  public wood = 0
  public stone = 0

  public showInHandItemIndex = 0
  public showInHandTimerSeconds = 0
  public showToolTimerSeconds = 0
  public showWood = false
  public showStone = false

  public haveAxe = false
  public showAxe = false
  public havePickaxe = false
  public showPickaxe = false

  constructor(unit: IGameObjectUnit) {
    super({ type: "INTERFACE" })

    this.x = -15
    this.y = 5

    this.unit = unit

    this.init()
  }

  init() {
    this.coins = this.unit.coins
    this.wood =
      this.unit.inventory.items.find((item) => item.type === "WOOD")?.amount ??
      0
    this.stone =
      this.unit.inventory.items.find((item) => item.type === "STONE")?.amount ??
      0

    this.haveAxe = !!this.unit.inventory.items.find(
      (item) => item.type === "AXE",
    )
    this.havePickaxe = !!this.unit.inventory.items.find(
      (item) => item.type === "PICKAXE",
    )

    this.drawUserName()
    this.drawWood()
    this.drawStone()
    this.drawAxe()
    this.drawPickaxe()

    this.setShowInHandTimer()
    this.setShowToolTimer()
  }

  rebuild() {
    this.removeChild(...this.children)
    this.drawUserName()
    this.drawWood()
    this.drawStone()
    this.drawAxe()
    this.drawPickaxe()
    this.showInHandTimerSeconds = 0
  }

  update() {
    const userName = this.unit.userName
    const wood =
      this.unit.inventory.items.find((item) => item.type === "WOOD")?.amount ??
      0
    const stone =
      this.unit.inventory.items.find((item) => item.type === "STONE")?.amount ??
      0
    const haveAxe = !!this.unit.inventory.items.find(
      (item) => item.type === "AXE",
    )
    const havePickaxe = !!this.unit.inventory.items.find(
      (item) => item.type === "PICKAXE",
    )

    if (
      userName !== this.userName ||
      this.unit.coins !== this.coins ||
      wood !== this.wood ||
      stone !== this.stone ||
      haveAxe !== this.haveAxe ||
      havePickaxe !== this.havePickaxe
    ) {
      this.userName = userName
      this.coins = this.unit.coins
      this.wood = wood
      this.stone = stone
      this.haveAxe = haveAxe
      this.havePickaxe = havePickaxe
      this.rebuild()
    }

    this.userName = this.unit.userName
    this.coins = this.unit.coins
    this.wood = wood
    this.stone = stone
    this.haveAxe = haveAxe
    this.havePickaxe = havePickaxe
  }

  animate() {
    this.visible = true
    this.update()

    for (const container of this.children) {
      container.visible = true

      if (container.type === "PLAYER_COINS") {
        if (!this.coins) {
          container.visible = false
        }
      }

      if (container.type === "PLAYER_WOOD") {
        if (this.wood <= 0 || !this.showWood) {
          container.visible = false
        }
      }

      if (container.type === "PLAYER_STONE") {
        if (this.stone <= 0 || !this.showStone) {
          container.visible = false
        }
      }

      if (container.type === "PLAYER_AXE") {
        if (!this.haveAxe || !this.showAxe) {
          container.visible = false
        }
      }

      if (container.type === "PLAYER_PICKAXE") {
        if (!this.havePickaxe || !this.showPickaxe) {
          container.visible = false
        }
      }
    }
  }

  drawUserName() {
    if (!this.unit.userName) {
      return
    }

    const container = new GraphicsContainer({ type: "INTERFACE" })

    const basicText = new Text({
      text: this.unit.userName,
      style: {
        fontFamily: "Noto Serif",
        fontSize: 14,
        fontWeight: "600",
        fill: 0x451a03,
        align: "center",
      },
    })

    const graphics = new Graphics()
    graphics.roundRect(-6, -2, basicText.width + 12, basicText.height + 4, 0)
    graphics.fill(0xfef3c7)

    container.addChild(graphics, basicText)

    container.x = -container.width / 2 + 24
    container.y = -84

    this.addChild(container)
  }

  drawWood() {
    const container = new GraphicsContainer({ type: "PLAYER_WOOD" })

    const woodSprite = Sprite.from("wood1")
    woodSprite.width = 32
    woodSprite.height = 32

    container.addChild(woodSprite)

    container.x = -18
    container.y = -48

    this.addChild(container)
  }

  drawStone() {
    const container = new GraphicsContainer({ type: "PLAYER_STONE" })

    const woodSprite = Sprite.from("stoneRes1")
    woodSprite.width = 32
    woodSprite.height = 32

    container.addChild(woodSprite)

    container.x = -18
    container.y = -48

    this.addChild(container)
  }

  drawAxe() {
    const container = new GraphicsContainer({ type: "PLAYER_AXE" })

    const sprite = Sprite.from("toolAxe1")
    sprite.width = 64
    sprite.height = 64

    container.addChild(sprite)

    container.x = -10
    container.y = -68

    this.addChild(container)
  }

  drawPickaxe() {
    const container = new GraphicsContainer({ type: "PLAYER_PICKAXE" })

    const sprite = Sprite.from("toolPickaxe1")
    sprite.width = 64
    sprite.height = 64

    container.addChild(sprite)

    container.x = -10
    container.y = -68

    this.addChild(container)
  }

  showWoodInHand() {
    this.showWood = true
  }

  showStoneInHand() {
    this.showStone = true
  }

  showAxeInHand() {
    this.showAxe = true
    this.showToolTimerSeconds = 5
  }

  showPickaxeInHand() {
    this.showPickaxe = true
    this.showToolTimerSeconds = 5
  }

  setShowInHandTimer() {
    return setInterval(() => {
      if (this.showInHandTimerSeconds <= 0) {
        this.showNextItem()
        return
      }

      this.showInHandTimerSeconds -= 1
    }, 1000)
  }

  setShowToolTimer() {
    return setInterval(() => {
      if (this.showToolTimerSeconds <= 0) {
        this.showAxe = false
        this.showPickaxe = false
        return
      }

      this.showToolTimerSeconds -= 1
    })
  }

  getResourcesArray() {
    return this.unit.inventory.items.filter(
      (item) => item.type === "WOOD" || item.type === "STONE",
    )
  }

  showNextItem() {
    const items = this.getResourcesArray()
    if (!items) {
      return
    }

    if (items.length < this.showInHandItemIndex + 1) {
      this.showInHandItemIndex = 0
    }

    this.showWood = false
    this.showStone = false
    this.showInHandTimerSeconds = 5

    if (!items[this.showInHandItemIndex]?.type) {
      return
    }

    switch (items[this.showInHandItemIndex].type) {
      case "WOOD":
        this.showWoodInHand()
        break
      case "STONE":
        this.showStoneInHand()
        break
    }

    this.showInHandItemIndex += 1
  }
}
