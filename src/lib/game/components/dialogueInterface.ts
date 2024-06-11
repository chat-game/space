import type { IGameObjectUnit } from "$lib/game/types"
import { type Container, Graphics, Text } from "pixi.js"
import { GraphicsContainer } from "./graphicsContainer"

export class DialogueInterface extends GraphicsContainer {
  public unit: IGameObjectUnit
  public messages: { id: string; text: string; isShowed: boolean }[]
  public showingSpeed: number

  constructor(unit: IGameObjectUnit) {
    super({ type: "INTERFACE" })

    this.unit = unit
    this.messages = []

    this.showingSpeed = 0.0005

    this.x = 0
    this.y = 0
  }

  create(message: { id: string; text: string }) {
    const container = new GraphicsContainer({ type: "INTERFACE" })

    const basicText = new Text({
      text: message.text,
      style: {
        fontFamily: "Noto Serif",
        fontSize: 16,
        fontWeight: "500",
        fill: 0x694f62,
        align: "left",
        wordWrap: true,
        wordWrapWidth: 300,
      },
    })

    const rectOffsetX = 8
    const rectOffsetY = 4
    const rectWidth = basicText.width + rectOffsetX * 2
    const rectHeight = basicText.height + rectOffsetY * 2

    const graphics = new Graphics()
    graphics.roundRect(-rectOffsetX, -rectOffsetY, rectWidth, rectHeight, 8)
    graphics.fill(0xffffff)

    container.addChild(graphics, basicText)

    container.x = -container.width / 2 + 8
    container.y = -container.height - 75

    this.addChild(container)
  }

  remove(container: Container) {
    return this.removeChild(container)
  }

  animate() {
    this.visible = true
    this.zIndex = 0

    // Add new messages to show
    if (this.unit?.dialogue?.messages) {
      for (const message of this.unit.dialogue.messages) {
        const existed = this.messages.find((m) => m.id === message.id)
        if (!existed) {
          this.messages.push({ ...message, isShowed: false })
        }
      }
    }

    // If no active - create new show block!
    const needToShowMessages = this.messages.filter((m) => !m.isShowed)
    if (needToShowMessages.length > 0 && this.children.length <= 0) {
      this.create(needToShowMessages[0])

      needToShowMessages[0].isShowed = true
      this.showingSpeed = this.getShowingSpeed(
        needToShowMessages[0].text.length,
      )
    }

    for (const container of this.children) {
      container.visible = true
      container.zIndex = 0
      container.alpha -= this.showingSpeed

      if (container.alpha <= 0.8) {
        this.remove(container)
      }
    }
  }

  getShowingSpeed(messageLength: number) {
    return 0.0006 - (messageLength * 4) / 1000000
  }
}
