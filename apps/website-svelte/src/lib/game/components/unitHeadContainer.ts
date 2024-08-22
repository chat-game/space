import { Sprite } from 'pixi.js'
import { GraphicsContainer } from './graphicsContainer'
import type { IGameObjectDirection, IGameObjectUnit } from '$lib/game/types'

interface IUnitHeadContainerOptions {
  direction: IGameObjectDirection
  visual: IGameObjectUnit['visual']['head']
}

export class UnitHeadContainer extends GraphicsContainer {
  public visual: IGameObjectUnit['visual']['head']

  constructor({ direction, visual }: IUnitHeadContainerOptions) {
    super({ type: 'UNIT_HEAD', direction })
    this.visual = visual
  }

  static create(
    spriteIndex: string,
    direction: IGameObjectDirection,
    visual: IGameObjectUnit['visual']['head']
  ) {
    const sprite = Sprite.from(spriteIndex)
    sprite.anchor.set(0.5, 1)

    if (direction === 'LEFT') {
      // Flip horizontally
      sprite.scale.x = -1
    }

    const container = new UnitHeadContainer({ direction, visual })
    container.addChild(sprite)

    return container
  }

  static createWithBothDirections(spriteIndex: string, visual: IGameObjectUnit['visual']['head']) {
    const containers = []

    containers.push(UnitHeadContainer.create(spriteIndex, 'LEFT', visual))
    containers.push(UnitHeadContainer.create(spriteIndex, 'RIGHT', visual))

    return containers
  }

  static getAll() {
    return [...UnitHeadContainer.createWithBothDirections('unitHead1', '1')]
  }
}
