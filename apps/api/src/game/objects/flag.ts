import { createId } from '@paralleldrive/cuid2'
import {
  type IGameObjectFlag,
  getRandomInRange,
} from '../../../../../packages/api-sdk/src'
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from '../../config'
import { GameObject } from './gameObject'

interface IFlagOptions {
  x?: number
  y?: number
  id?: string
  type: IGameObjectFlag['type']
  offsetX?: number
  offsetY?: number
}

export class Flag extends GameObject implements IGameObjectFlag {
  public type: IGameObjectFlag['type']

  public isReserved: boolean
  public offsetX: number
  public offsetY: number

  constructor({ x, y, id, type, offsetX, offsetY }: IFlagOptions) {
    const finalId = id ?? createId()
    const finalX = x ?? getRandomInRange(MIN_X, MAX_X)
    const finalY = y ?? getRandomInRange(MIN_Y, MAX_Y)

    super({ id: finalId, x: finalX, y: finalY, entity: 'FLAG' })

    this.type = type
    this.isReserved = false
    this.offsetX = offsetX ?? 0
    this.offsetY = offsetY ?? 0
  }

  live() {
    if (this.target && this.target.state === 'DESTROYED') {
      this.removeTarget()
    }

    const random = getRandomInRange(1, 60)
    if (random <= 1) {
      this.handleChange()
    }
  }

  handleChange() {
    this.sendMessageObjectUpdated()
  }

  removeTarget() {
    this.target = undefined
  }
}
