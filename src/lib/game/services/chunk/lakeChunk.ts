import { BaseChunk } from './baseChunk'
import { getRandomInRange } from '$lib/random'
import type {
  Game,
} from '$lib/game/types'
import { Lake } from '$lib/game/objects/lake'
import { TreeObject } from '$lib/game/objects/treeObject'
import { StoneObject } from '$lib/game/objects/stoneObject'
import type {
  IGameChunkTheme,
  IGameLakeChunk,
} from '$lib/game/services/chunk/interface'

interface LakeChunkOptions {
  game: Game
  center: IGameLakeChunk['center']
  width: number
  height: number
  theme: IGameChunkTheme
}

export class LakeChunk extends BaseChunk implements IGameLakeChunk {
  constructor({ game, width, height, center, theme }: LakeChunkOptions) {
    super({
      game,
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
    this.#initTrees(treesToPrepare)
    this.#initStones(3)
    this.#initLake()
  }

  #initLake() {
    new Lake({
      game: this.game,
      x: this.center.x - 100,
      y: this.center.y + 400,
    }).init()
    new Lake({
      game: this.game,
      x: this.center.x - 600,
      y: this.center.y + 500,
    }).init()
  }

  #initTrees(count: number) {
    for (let i = 0; i < count; i++) {
      const point = this.randomPoint
      const size = getRandomInRange(75, 90)
      new TreeObject({
        game: this.game,
        x: point.x,
        y: point.y,
        size,
        resource: 1,
        health: 20,
        theme: this.area.theme,
      }).init()
    }
  }

  #initStones(count: number) {
    for (let i = 0; i < count; i++) {
      const point = this.randomPoint
      new StoneObject({
        game: this.game,
        x: point.x,
        y: point.y,
        resource: 1,
      }).init()
    }
  }
}
