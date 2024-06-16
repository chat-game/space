import { Lake, Stone, Tree } from '../objects'
import { GameChunk } from './gameChunk'
import { getRandomInRange } from '$lib/random'
import type {
  GameScene,
  IGameChunkTheme,
  IGameLakeChunk,
} from '$lib/game/types'

interface ILakeOptions {
  scene: GameScene
  center: IGameLakeChunk['center']
  width: number
  height: number
  theme: IGameChunkTheme
}

export class LakeChunk extends GameChunk implements IGameLakeChunk {
  constructor({ scene, width, height, center, theme }: ILakeOptions) {
    super({
      scene,
      width,
      height,
      center,
      theme,
      title: 'Lake with a Secret',
      type: 'LAKE',
    })

    const treesToPrepare = Math.round(
      (this.area.area.endX - this.area.area.startX) / 30,
    )
    this.initTrees(treesToPrepare)
    this.initStones(3)
    this.initLake()
  }

  live() {
    super.live()

    for (const obj of this.objects) {
      void obj.live()
    }
  }

  initLake() {
    const lake = new Lake({
      scene: this.scene,
      x: this.center.x - 100,
      y: this.center.y + 400,
    })
    const lake2 = new Lake({
      scene: this.scene,
      x: this.center.x - 600,
      y: this.center.y + 500,
    })
    this.objects.push(lake, lake2)
  }

  initTrees(count: number) {
    for (let i = 0; i < count; i++) {
      const point = this.getRandomPoint()
      const size = getRandomInRange(75, 90)
      const tree = new Tree({
        scene: this.scene,
        x: point.x,
        y: point.y,
        size,
        resource: 1,
        health: 20,
        variant: this.area.theme,
      })
      this.objects.push(tree)
    }
  }

  initStones(count: number) {
    for (let i = 0; i < count; i++) {
      const point = this.getRandomPoint()
      const stone = new Stone({
        scene: this.scene,
        x: point.x,
        y: point.y,
        resource: 1,
      })
      this.objects.push(stone)
    }
  }
}
