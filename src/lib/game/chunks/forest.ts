import { type IGameChunkTheme, type IGameForestChunk, } from "$lib/game/types"
import { Stone, Tree } from "../objects"
import type { GameScene } from "../scenes/gameScene.ts"
import { GameChunk } from "./gameChunk"
import { getRandomInRange } from "$lib/random";

interface IForestOptions {
  center: IGameForestChunk["center"]
  width: number
  height: number
  theme: IGameChunkTheme
  scene: GameScene
}

export class Forest extends GameChunk implements IGameForestChunk {
  constructor({ width, height, center, theme, scene }: IForestOptions) {
    super({
      title: "Grand Wood",
      type: "FOREST",
      width,
      height,
      center,
      theme,
      scene,
    })

    const treesToPrepare = Math.round(
      (this.area.area.endX - this.area.area.startX) / 10,
    )
    this.initTrees(treesToPrepare)
    this.initStones(3)
  }

  live() {
    super.live()

    for (const obj of this.objects) {
      void obj.live()
    }
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
