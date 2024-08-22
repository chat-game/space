import { type Container, Graphics, Text } from 'pixi.js'
import { GraphicsContainer } from './graphicsContainer'
import type { IGameObjectUnit } from '$lib/game/types'

export class DialogueInterface extends GraphicsContainer {
  public unit: IGameObjectUnit
  public messages: { id: string; text: string; isShowed: boolean }[]
  #showingSpeed: number

  constructor(unit: IGameObjectUnit) {
    super({ type: 'INTERFACE' })

    this.unit = unit
    this.messages = []

    this.#showingSpeed = 0.05

    this.x = 0
    this.y = 0
  }

  create(message: { id: string; text: string }) {
    const container = new GraphicsContainer({ type: 'INTERFACE' })

    const basicText = new Text({
      text: message.text,
      style: {
        fontFamily: 'Noto Serif',
        fontSize: 16,
        fontWeight: '500',
        fill: 0x451a03,
        align: 'left',
        wordWrap: true,
        wordWrapWidth: 350,
      },
    })

    const rectOffsetX = 8
    const rectOffsetY = 4
    const rectWidth = basicText.width + rectOffsetX * 2
    const rectHeight = basicText.height + rectOffsetY * 2

    const graphics = new Graphics()
    graphics.rect(-rectOffsetX, -rectOffsetY, rectWidth, rectHeight)
    graphics.fill(0xfef3c7)

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
      this.#showingSpeed = this.#getShowingSpeed(needToShowMessages[0].text.length)
    }

    for (const container of this.children) {
      container.visible = true
      container.zIndex = 0
      container.alpha -= this.#showingSpeed

      if (container.alpha <= 0.8) {
        this.remove(container)
      }
    }
  }

  #getShowingSpeed(messageLength: number) {
    return (0.05 - (messageLength * 4) / 10000) / this.unit.game.tick
  }
}
