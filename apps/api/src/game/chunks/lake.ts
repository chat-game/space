import {
  type IGameChunkTheme,
  type IGameLakeChunk,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src"
import { Lake, Stone, Tree } from "../objects"
import { GameChunk } from "./gameChunk"

interface ILakeOptions {
  center: IGameLakeChunk["center"]
  width: number
  height: number
  theme: IGameChunkTheme
}

export class LakeChunk extends GameChunk implements IGameLakeChunk {
  constructor({ width, height, center, theme }: ILakeOptions) {
    super({
      title: "Озеро с Секретом",
      type: "LAKE",
      width,
      height,
      center,
      theme,
    })

    const treesToPrepare = Math.round(
      (this.area.area.endX - this.area.area.startX) / 30,
    )
    console.log(`preparing ${treesToPrepare} trees`)
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
    const lake = new Lake({ x: this.center.x - 100, y: this.center.y + 400 })
    const lake2 = new Lake({ x: this.center.x - 600, y: this.center.y + 500 })
    this.objects.push(lake, lake2)
  }

  initTrees(count: number) {
    for (let i = 0; i < count; i++) {
      const point = this.getRandomPoint()
      const size = getRandomInRange(75, 90)
      const tree = new Tree({
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
      const stone = new Stone({ x: point.x, y: point.y, resource: 1 })
      this.objects.push(stone)
    }
  }
}
