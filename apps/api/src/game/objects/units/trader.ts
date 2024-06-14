import { createId } from '@paralleldrive/cuid2'
import type { IGameObjectTrader } from '../../../../../../packages/api-sdk/src'
import { generateUnitUserName } from '../../common/generators/unitName'
import { generateUnitTop } from '../../common/generators/unitTop'
import { Unit } from './unit'

interface ITraderOptions {
  x: number
  y: number
}

export class Trader extends Unit implements IGameObjectTrader {
  constructor({ x, y }: ITraderOptions) {
    const id = createId()

    super({
      id,
      x,
      y,
      entity: 'TRADER',
      visual: {
        head: '1',
        hairstyle: 'COAL_LONG',
        top: generateUnitTop(),
      },
    })

    this.speedPerSecond = 1
    this.minDistance = 5
    this.userName = generateUnitUserName()
  }

  live() {
    super.live()
    this.handleChange()
  }

  handleChange() {
    const prepared = {
      ...this,
      script: undefined,
      live: undefined,
    }

    this.sendMessageObjectUpdated(prepared)
  }
}
