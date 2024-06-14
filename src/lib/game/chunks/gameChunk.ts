import { createId } from '@paralleldrive/cuid2'
import { Area, type GameObject, Tree } from '../objects'
import type { GameScene } from '../scenes/gameScene.ts'
import { getRandomInRange } from '$lib/random'
import type { IGameChunk, IGameChunkTheme } from '$lib/game/types'

interface IGameChunkOptions {
  center: IGameChunk['center']
  title: IGameChunk['title']
  type: IGameChunk['type']
  theme: IGameChunkTheme
  width: number
  height: number
  scene: GameScene
}

export class GameChunk implements IGameChunk {
  public id: string
  public title: string
  public type: IGameChunk['type']
  public center!: IGameChunk['center']
  public area!: Area

  public scene: GameScene
  public objects: GameObject[] = []

  constructor({
    title,
    type,
    theme,
    width,
    height,
    center,
    scene,
  }: IGameChunkOptions) {
    this.id = createId()
    this.center = center
    this.title = title
    this.type = type

    this.scene = scene

    this.initArea({ width, height, theme })
  }

  public live() {}

  private initArea({
    width,
    height,
    theme,
  }: {
    width: number
    height: number
    theme: IGameChunkTheme
  }) {
    const halfWidth = Math.round(width / 2)
    const halfHeight = Math.round(height / 2)

    const area = {
      startX: this.center.x - halfWidth,
      endX: this.center.x + halfWidth,
      startY: this.center.y - halfHeight,
      endY: this.center.y + halfHeight,
    }

    this.area = new Area({ scene: this.scene, theme, area })
  }

  public getRandomPoint() {
    return {
      x: getRandomInRange(this.area.area.startX, this.area.area.endX),
      y: getRandomInRange(this.area.area.startY, this.area.area.endY),
    }
  }

  public getRandomOutPoint() {
    const height = this.area.area.endY - this.area.area.startY
    const offsetFromTop = Math.round(height / 4)

    return {
      x: this.area.area.endX,
      y: getRandomInRange(
        this.area.area.startY + offsetFromTop,
        this.area.area.endY,
      ),
    }
  }

  public checkIfPointIsInArea(point: { x: number, y: number }): boolean {
    if (point.x >= this.area.area.startX && point.x <= this.area.area.endX) {
      if (point.y >= this.area.area.startY && point.y <= this.area.area.endY) {
        return true
      }
    }

    return false
  }

  removeObject(object: GameObject) {
    const index = this.objects.indexOf(object)
    this.objects.splice(index, 1)
  }

  getAvailableTree(): Tree | undefined {
    const trees = this.objects.filter(
      (obj) =>
        obj instanceof Tree
        && obj.state !== 'DESTROYED'
        && !obj.isReserved
        && obj.isReadyToChop,
    )
    if (!trees || !trees.length) {
      return undefined
    }

    return trees[Math.floor(Math.random() * trees.length)] as Tree
  }
}
