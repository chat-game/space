import { type Container, Sprite } from 'pixi.js'
import { GraphicsContainer } from './graphicsContainer'
import type { Wagon } from '$lib/game/objects'
import { getRandomInRange } from '$lib/random'

interface IWagonEngineCloudsContainerOptions {
  wagon: Wagon
}

export class WagonEngineCloudsContainer extends GraphicsContainer {
  private offset = 0
  private wagon: Wagon

  constructor({ wagon }: IWagonEngineCloudsContainerOptions) {
    super({ type: 'WAGON_ENGINE_CLOUD', direction: 'LEFT' })

    this.x = -106
    this.y = -118

    this.wagon = wagon
  }

  createRandom() {
    const sprite = Sprite.from(this.getRandomSpriteIndex())
    sprite.anchor.set(0.5, 1)
    sprite.scale = 0.75
    sprite.visible = false

    this.addChild(sprite)
  }

  getRandomSpriteIndex() {
    const random = getRandomInRange(1, 1000)
    if (random <= 500) {
      return 'wagonEngineCloud1'
    }
    if (random <= 750) {
      return 'wagonEngineCloud2'
    }
    if (random <= 995) {
      return 'wagonEngineCloud3'
    }
    return 'wagonEngineCloud4'
  }

  remove(container: Container) {
    return this.removeChild(container)
  }

  animate(speed: number) {
    this.offset -= speed + 1

    const cloudsActive = speed * 8 + 1
    const canCreateCloud
      = this.children.length < cloudsActive && this.offset <= 0
    if (canCreateCloud) {
      this.createRandom()
      this.offset = speed * getRandomInRange(170, 190) + 3
    }

    for (const container of this.children) {
      container.visible = true

      container.x -= (speed / 3 + 2.5) / this.wagon.scene.game.tick
      container.y -= 3 / this.wagon.scene.game.tick
      container.alpha -= 0.5 / this.wagon.scene.game.tick

      if (container.alpha <= 0) {
        this.remove(container)
      }
    }
  }
}
