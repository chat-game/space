import type { Game } from './types'
import { createId } from '@paralleldrive/cuid2'
import { Application, Container, TextureStyle } from 'pixi.js'
import { BackgroundGenerator } from './utils/background'

export class BaseGame extends Container implements Game {
  id: string
  app: Application

  constructor() {
    super()

    this.id = createId()
    this.app = new Application()
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

    this.app.stage.eventMode = 'static'
    this.app.screen.width = window.innerWidth
    this.app.screen.height = window.innerHeight

    await this.#generateBackground()

    this.app.stage.addChild(this)

    this.app.ticker.add(() => {
      //
    })
  }

  async #generateBackground() {
    const bg = await new BackgroundGenerator(this.app).generate({
      width: this.app.screen.width,
      height: this.app.screen.height,
      theme: 'GREEN',
    })
    bg.x = 0
    bg.y = 0
    bg.width = this.app.screen.width * 2
    bg.height = this.app.screen.height * 2
    this.app.stage.addChild(bg)
  }
}
