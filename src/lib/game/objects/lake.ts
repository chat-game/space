import type { IGameObjectLake } from "$lib/game/types"
import { AssetsManager } from "../utils"
import { GameObject } from "./gameObject"
import { GameScene } from "../scenes/gameScene";
import { Water } from "./water";

interface ILakeOptions {
  scene: GameScene
  x: number
  y: number
}

export class Lake extends GameObject implements IGameObjectLake {
  public water: Water[] = []

  constructor({ scene, x, y }: ILakeOptions) {
    super({ scene, x, y })

    this.generate(13)
    this.initGraphics()
  }

  public animate() {
    super.animate();

    this.zIndex = 0
  }

  generate(r: number) {
    for (let y = r; y >= -r; --y) {
      for (let x = -r; x <= r; x++) {
        const value = x ** 2 + y ** 2

        if (value < r ** 2) {
          this.draw(x, y)
        }
      }
    }
  }

  draw(x: number, y: number) {
    const water = new Water({ scene: this.scene, x: x * 32, y: y * 32 })
    this.water.push(water)
  }

  init(width: number, height: number) {
    const gridX = Math.ceil(width / 32)
    const gridY = Math.floor(height / 32)

    console.log(gridX, gridY)

    //const center = { x: Math.round(width / 2), y: Math.round(height / 2) }

    for (let i = 0; i < gridX; i++) {
      for (let j = 0; j < gridY; j++) {
        const x = i * 32
        const y = j * 32

        // if (x <= center.x && y <= center.y) {
        //   continue
        // }

        const water = new Water({ scene: this.scene, x, y })
        this.water.push(water)
      }
    }
  }

  private initGraphics() {
    for (const w of this.water) {
      const sprite = AssetsManager.getRandomSpriteForWater()
      sprite.anchor.set(0.5, 1)
      sprite.x = w.x
      sprite.y = w.y
      this.addChild(sprite)
    }
  }
}
