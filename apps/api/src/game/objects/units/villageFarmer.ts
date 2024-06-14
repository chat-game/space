import { createId } from '@paralleldrive/cuid2'
import type { IGameObjectFarmer } from '../../../../../../packages/api-sdk/src'
import { generateUnitUserName } from '../../common/generators/unitName'
import { generateUnitTop } from '../../common/generators/unitTop'
import { Unit } from './unit'

interface IVillageFarmerOptions {
  x: number
  y: number
}

export class VillageFarmer extends Unit implements IGameObjectFarmer {
  constructor({ x, y }: IVillageFarmerOptions) {
    const id = createId()

    super({
      id,
      x,
      y,
      entity: 'FARMER',
      visual: {
        head: '1',
        hairstyle: 'ORANGE_WITH_BEARD',
        top: generateUnitTop(),
      },
    })

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
