import { createId } from '@paralleldrive/cuid2'
import {
  type IGameObjectLake,
  getRandomInRange,
} from '../../../../../packages/api-sdk/src'
import { GameObject } from './gameObject'
import { Water } from './water'

interface ILakeOptions {
  x: number
  y: number
  id?: string
}

export class Lake extends GameObject implements IGameObjectLake {
  public water: Water[] = []

  constructor({ id, x, y }: ILakeOptions) {
    const objectId = id ?? createId()

    super({ id: objectId, x, y, entity: 'LAKE' })

    this.generate(13)
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
    const water = new Water({ x: x * 32, y: y * 32 })
    this.water.push(water)
  }

  init(width: number, height: number) {
    const gridX = Math.ceil(width / 32)
    const gridY = Math.floor(height / 32)

    // const center = { x: Math.round(width / 2), y: Math.round(height / 2) }

    for (let i = 0; i < gridX; i++) {
      for (let j = 0; j < gridY; j++) {
        const x = i * 32
        const y = j * 32

        // if (x <= center.x && y <= center.y) {
        //   continue
        // }

        const water = new Water({ x, y })
        this.water.push(water)
      }
    }
  }

  live() {
    if (this.state === 'IDLE') {
      const random = getRandomInRange(1, 600)
      if (random <= 1) {
        this.handleChange()
      }
    }
  }

  handleChange() {
    this.sendMessageObjectUpdated()
  }
}
