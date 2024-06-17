import { createId } from '@paralleldrive/cuid2'
import { getRandomInRange } from '$lib/random'
import type {
  Game,
  GameObjectFlag,
  IGameBuildingConstructionArea,
  IGameBuildingStore,
  IGameBuildingWagonStop, IGameBuildingWarehouse,
} from '$lib/game/types'
import { Area } from '$lib/game/objects/area'
import { TreeObject } from '$lib/game/objects/treeObject'
import type {
  GameChunk,
  IGameChunkTheme,
} from '$lib/game/services/chunk/interface'
import { FlagObject } from '$lib/game/objects/flagObject'

interface IGameChunkOptions {
  center: GameChunk['center']
  title: GameChunk['title']
  type: GameChunk['type']
  theme: IGameChunkTheme
  width: number
  height: number
  game: Game
}

export class BaseChunk implements GameChunk {
  id: GameChunk['id']
  title: GameChunk['title']
  type: GameChunk['type']
  center!: GameChunk['center']
  area!: GameChunk['area']
  game: Game

  constructor({
    title,
    type,
    theme,
    width,
    height,
    center,
    game,
  }: IGameChunkOptions) {
    this.id = createId()
    this.center = center
    this.title = title
    this.type = type
    this.game = game

    this.#initArea({ width, height, theme })
  }

  live() {}

  #initArea({
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

    this.area = new Area({ game: this.game, theme, area })
  }

  public getRandomPoint() {
    return {
      x: getRandomInRange(this.area.area.startX, this.area.area.endX),
      y: getRandomInRange(this.area.area.startY, this.area.area.endY),
    }
  }

  get randomOutPoint() {
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

  isPointInArea(point: { x: number, y: number }): boolean {
    if (point.x >= this.area.area.startX && point.x <= this.area.area.endX) {
      if (point.y >= this.area.area.startY && point.y <= this.area.area.endY) {
        return true
      }
    }

    return false
  }

  get availableTree() {
    const trees = this.game.children.filter(
      (obj) =>
        obj instanceof TreeObject
        && obj.chunkId === this.id
        && obj.state !== 'DESTROYED'
        && !obj.isReserved
        && obj.isReadyToChop,
    )
    if (!trees || !trees.length) {
      return undefined
    }

    return trees[Math.floor(Math.random() * trees.length)] as TreeObject
  }

  get randomMovementFlag() {
    const flags = this.game.children.filter(
      (f) => f instanceof FlagObject && f.chunkId === this.id && f.variant === 'MOVEMENT',
    )

    return flags.length > 0
      ? flags[Math.floor(Math.random() * flags.length)] as GameObjectFlag
      : undefined
  }

  get warehouse() {
    return this.game.children.find((b) => b.type === 'WAREHOUSE') as IGameBuildingWarehouse | undefined
  }

  get store() {
    return this.game.children.find((b) => b.type === 'STORE') as IGameBuildingStore | undefined
  }

  get constructionArea() {
    return this.game.children.find((b) => b.type === 'CONSTRUCTION_AREA') as IGameBuildingConstructionArea | undefined
  }

  get wagonStop(): IGameBuildingWagonStop | undefined {
    return this.game.children.find((b) => b.type === 'WAGON_STOP') as IGameBuildingWagonStop | undefined
  }
}
