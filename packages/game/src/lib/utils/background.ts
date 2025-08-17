import type { Application } from 'pixi.js'
import type { ChunkTheme } from '../types'
import { Container, Graphics, Sprite, TilingSprite } from 'pixi.js'
import {
  BACKGROUND_TILE_1,
  BACKGROUND_TILE_2,
  BACKGROUND_TILE_3,
  BACKGROUND_TILE_4,
  BACKGROUND_TILE_5,
} from './backgroundImages'
import { getRandInteger } from './random'

interface Palette {
  93: string
  97: string
  103: string
  111: string
  115: string
  123: string
  136: string
  147: string
  149: string
  151: string
  153: string
  156: string
  168: string
  173: string
  203: string
  206: string
  209: string
  211: string
  213: string
  218: string
}

export class BackgroundGenerator {
  app: Application
  palette!: Palette
  mainColor1!: string
  mainColor2!: string
  accentColor1!: string
  accentColor2!: string
  accentColor3!: string

  constructor(app: Application) {
    this.app = app

    this.#changePaletteByTheme('GREEN')
    this.#changePalette()
  }

  #changePaletteByTheme(theme: ChunkTheme) {
    if (theme === 'GREEN') {
      this.mainColor1 = '0x239063'
      this.mainColor2 = '0x1ebc73'
      this.accentColor1 = '0x91db69'
      this.accentColor2 = '0xcddf6c'
      this.accentColor3 = '0x8fd3ff'
    }
    if (theme === 'TOXIC') {
      this.mainColor1 = '0xa2a947'
      this.mainColor2 = '0xd5e04b'
      this.accentColor1 = '0xf9c22b'
      this.accentColor2 = '0xed8099'
      this.accentColor3 = '0xb2ba90'
    }
    if (theme === 'VIOLET') {
      this.mainColor1 = '0x6b3e75'
      this.mainColor2 = '0x905ea9'
      this.accentColor1 = '0xfdcbb0'
      this.accentColor2 = '0xfbb954'
      this.accentColor3 = '0x8fd3ff'
    }
    if (theme === 'BLUE') {
      this.mainColor1 = '0x4d65b4'
      this.mainColor2 = '0x4d9be6'
      this.accentColor1 = '0xa884f3'
      this.accentColor2 = '0xc7dcd0'
      this.accentColor3 = '0x8ff8e2'
    }
    if (theme === 'TEAL') {
      this.mainColor1 = '0x0b5e65'
      this.mainColor2 = '0x0b8a8f'
      this.accentColor1 = '0xfdcbb0'
      this.accentColor2 = '0xfbb954'
      this.accentColor3 = '0xf9c22b'
    }
    if (theme === 'STONE') {
      this.mainColor1 = '0x374e4a'
      this.mainColor2 = '0x547e64'
      this.accentColor1 = '0xfca790'
      this.accentColor2 = '0xeaaded'
      this.accentColor3 = '0x8fd3ff'
    }

    this.#changePalette()
  }

  #changePalette() {
    this.palette = {
      93: this.mainColor1,
      97: this.mainColor1,
      103: this.mainColor1,
      111: this.mainColor2,
      115: this.mainColor2,
      123: '0xcd683d', // brown
      136: '0xcd683d', // brown
      147: this.accentColor1,
      149: '0x92a984', // light neutral
      151: '0xe6904e', // orange
      153: this.accentColor1,
      156: this.accentColor1,
      168: '0xf68181', // bright pink
      173: '0xfbb954', // light orange
      203: '0x8fd3ff', // light blue
      206: this.accentColor2,
      209: '0xc7dcd0', // almost white
      211: this.accentColor3,
      213: this.accentColor3,
      218: '0xfbff86', // light yellow
    }
  }

  public async generate(data: { width: number, height: number, theme: ChunkTheme }) {
    this.#changePaletteByTheme(data.theme)

    const bg = this.#generateRandomGridBackground({
      width: data.width,
      height: data.height,
    })
    const container = new Container()
    container.addChild(...bg)

    const texture = this.app.renderer.generateTexture(container)
    container.destroy()

    return new TilingSprite({ texture })
  }

  #generateRandomGridBackground({
    width,
    height,
  }: {
    width: number
    height: number
  }) {
    const gridX = Math.ceil(width / 64)
    const gridY = Math.floor(height / 64)

    const bg: Sprite[] = []

    for (let i = 0; i < gridX; i++) {
      for (let j = 0; j < gridY; j++) {
        const background = this.#getRandomSpriteForBackground()
        if (!background) {
          continue
        }

        background.x = i * 64
        background.y = j * 64

        bg.push(background)
      }
    }

    return bg
  }

  #generateTexture(imageArray: number[]) {
    if (!imageArray.length) {
      return
    }

    const imageWidth = Math.sqrt(imageArray.length)

    const graphics = new Graphics()

    let index = 0
    for (let y = 0; y < imageWidth; y++) {
      for (let x = 0; x < imageWidth; x++) {
        const grayscaleKey = imageArray[index]

        if (!grayscaleKey || !(grayscaleKey in this.palette)) {
          // Not found!
          // console.log('Not found key in Palette:', grayscaleKey)
          continue
        }

        const color = this.palette[grayscaleKey as keyof Palette]

        graphics.rect(x, y, 1, 1).fill(color)
        index++
      }
    }

    return this.app.renderer.generateTexture({
      target: graphics,
      resolution: 4,
    })
  }

  #getRandomSpriteForBackground() {
    const tileArray = this.#getTileByRandomChance()
    const texture = this.#generateTexture(tileArray)
    if (!texture) {
      return
    }

    const sprite = Sprite.from(texture)
    sprite.scale = 4

    return sprite
  }

  #getTileByRandomChance(): number[] {
    const randomMax = 100
    const random = getRandInteger(1, randomMax)

    if (random <= 55) {
      return BACKGROUND_TILE_1
    }
    if (random <= 93) {
      return BACKGROUND_TILE_2
    }
    if (random <= 96) {
      return BACKGROUND_TILE_3
    }
    if (random <= 98) {
      return BACKGROUND_TILE_4
    }
    return BACKGROUND_TILE_5
  }
}
