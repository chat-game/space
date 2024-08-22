import { Sprite } from 'pixi.js'
import { GraphicsContainer } from './graphicsContainer'
import type { IGameObjectDirection, IGameObjectUnit } from '$lib/game/types'

interface IUnitTopContainerOptions {
  direction: IGameObjectDirection
  visual: IGameObjectUnit['visual']['top']
}

export class UnitTopContainer extends GraphicsContainer {
  public visual: IGameObjectUnit['visual']['top']

  constructor({ direction, visual }: IUnitTopContainerOptions) {
    super({ type: 'UNIT_TOP', direction })
    this.visual = visual
  }

  static create(
    spriteIndex: string,
    direction: IGameObjectDirection,
    visual: IGameObjectUnit['visual']['top']
  ) {
    const sprite = Sprite.from(spriteIndex)
    sprite.anchor.set(0.5, 1)

    if (direction === 'LEFT') {
      // Flip horizontally
      sprite.scale.x = -1
    }

    const container = new UnitTopContainer({ direction, visual })
    container.addChild(sprite)

    return container
  }

  static createWithBothDirections(spriteIndex: string, visual: IGameObjectUnit['visual']['top']) {
    const containers = []

    containers.push(UnitTopContainer.create(spriteIndex, 'LEFT', visual))
    containers.push(UnitTopContainer.create(spriteIndex, 'RIGHT', visual))

    return containers
  }

  static getAll() {
    return [
      ...UnitTopContainer.createWithBothDirections('violetTop', 'VIOLET_SHIRT'),
      ...UnitTopContainer.createWithBothDirections('blackTop', 'BLACK_SHIRT'),
      ...UnitTopContainer.createWithBothDirections('greenTop', 'GREEN_SHIRT'),
      ...UnitTopContainer.createWithBothDirections('blueTop', 'BLUE_SHIRT'),
      ...UnitTopContainer.createWithBothDirections('darkSilverTop', 'DARK_SILVER_SHIRT'),
    ]
  }
}
