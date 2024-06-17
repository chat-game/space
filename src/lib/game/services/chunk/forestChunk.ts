import { BaseChunk } from './baseChunk'
import { getRandomInRange } from '$lib/random'
import type {
  Game,
} from '$lib/game/types'
import { TreeObject } from '$lib/game/objects/treeObject'
import { StoneObject } from '$lib/game/objects/stoneObject'
import type {
  IGameChunkTheme,
  IGameForestChunk,
} from '$lib/game/services/chunk/interface'

interface ForestChunkOptions {
  center: IGameForestChunk['center']
  width: number
  height: number
  theme: IGameChunkTheme
  game: Game
}

export class ForestChunk extends BaseChunk implements IGameForestChunk {
  constructor({ width, height, center, theme, game }: ForestChunkOptions) {
    super({
      title: 'Grand Wood',
      type: 'FOREST',
      width,
      height,
      center,
      theme,
      game,
    })

    const treesToPrepare = Math.round(
      (this.area.area.endX - this.area.area.startX) / 10,
    )
    this.#initTrees(treesToPrepare)
    this.#initStones(3)
  }

  #initTrees(count: number) {
    for (let i = 0; i < count; i++) {
      const point = this.getRandomPoint()
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
      const point = this.getRandomPoint()
      new StoneObject({
        game: this.game,
        x: point.x,
        y: point.y,
        resource: 1,
      }).init()
    }
  }
}
