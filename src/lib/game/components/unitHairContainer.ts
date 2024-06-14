import { Sprite } from 'pixi.js'
import { GraphicsContainer } from './graphicsContainer'
import type { IGameObjectDirection, IGameObjectUnit } from '$lib/game/types'

interface IUnitHairContainerOptions {
  direction: IGameObjectDirection
  visual: IGameObjectUnit['visual']['hairstyle']
}

export class UnitHairContainer extends GraphicsContainer {
  public visual: IGameObjectUnit['visual']['hairstyle']

  constructor({ direction, visual }: IUnitHairContainerOptions) {
    super({ type: 'UNIT_HAIR', direction })
    this.visual = visual
  }

  static create(
    spriteIndex: string,
    direction: IGameObjectDirection,
    visual: IGameObjectUnit['visual']['hairstyle'],
  ) {
    const sprite = Sprite.from(spriteIndex)
    sprite.anchor.set(0.5, 1)

    if (direction === 'LEFT') {
      // Flip horizontally
      sprite.scale.x = -1
    }

    const container = new UnitHairContainer({ direction, visual })
    container.addChild(sprite)

    return container
  }

  static createWithBothDirections(
    spriteIndex: string,
    visual: IGameObjectUnit['visual']['hairstyle'],
  ) {
    const containers = []

    containers.push(UnitHairContainer.create(spriteIndex, 'LEFT', visual))
    containers.push(UnitHairContainer.create(spriteIndex, 'RIGHT', visual))

    return containers
  }

  static getAll() {
    return [
      ...UnitHairContainer.createWithBothDirections(
        'unitHairClassic',
        'CLASSIC',
      ),
      ...UnitHairContainer.createWithBothDirections(
        'unitHairCoalLong',
        'COAL_LONG',
      ),
      ...UnitHairContainer.createWithBothDirections(
        'unitHairOrangeWithBeard',
        'ORANGE_WITH_BEARD',
      ),
    ]
  }
}
