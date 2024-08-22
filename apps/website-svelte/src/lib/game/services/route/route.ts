import { FlagObject } from '$lib/game/objects/flagObject'
import type { GameChunk } from '$lib/game/services/chunk/interface'
import type { Game } from '$lib/game/types'
import type { IGameRoute } from '$lib/game/services/route/interface'

interface IRoutePoint {
  x: number
  y: number
}

interface IRouteArea {
  startX: number
  endX: number
  startY: number
  endY: number
}

interface IRouteOptions {
  game: Game
}

export class Route implements IGameRoute {
  public startPoint!: IRoutePoint
  public endPoint!: IRoutePoint
  public chunks: GameChunk[] = []

  game: Game
  public flags: FlagObject[] = []
  public areas: IRouteArea[] = []

  constructor({ game }: IRouteOptions) {
    this.game = game
  }

  setEndPoint({ x, y }: IRoutePoint) {
    this.endPoint = { x, y }
  }

  #addFlag({ x, y }: IRoutePoint) {
    const movementFlag = new FlagObject({
      game: this.game,
      variant: 'WAGON_MOVEMENT',
      x,
      y,
    })

    const prevFlag = this.flags[this.flags.length - 1]
    if (prevFlag) {
      this.#initArea(prevFlag, movementFlag)
    }

    this.flags.push(movementFlag)
  }

  addGlobalFlag(end: IRoutePoint) {
    const prevGlobalFlag = this.flags[this.flags.length - 1]
    if (!prevGlobalFlag) {
      return this.#addFlag(end)
    }

    this.#generatePath({ x: prevGlobalFlag.x, y: prevGlobalFlag.y }, end)
    this.#addFlag({ x: end.x, y: end.y })
  }

  removeFlag(id: string) {
    const index = this.flags.findIndex((f) => f.id === id)
    if (index >= 0) {
      this.flags.splice(index, 1)
    }
  }

  #initArea(flag1: FlagObject, flag2: FlagObject) {
    const offset = 150
    const halfOffset = offset / 2

    const startX = Math.min(flag1.x, flag2.x) - offset
    const endX = Math.max(flag1.x, flag2.x) + offset

    const startY = Math.min(flag1.y, flag2.y) - halfOffset
    const endY = Math.max(flag1.y, flag2.y) + halfOffset

    const area = {
      startX,
      endX,
      startY,
      endY,
    }

    this.areas.push(area)
  }

  #isInArea(area: IRouteArea, point: IRoutePoint) {
    return (
      area.startX < point.x && point.x < area.endX && area.startY < point.y && point.y < area.endY
    )
  }

  checkIfPointIsOnWagonPath(point: IRoutePoint) {
    for (const area of this.areas) {
      if (this.#isInArea(area, point)) {
        return true
      }
    }

    return false
  }

  #generatePath(start: IRoutePoint, end: IRoutePoint) {
    const pathDistance = Route.getDistanceBetween2Points(start, end)
    console.log('path', pathDistance)

    const pointsCount = Math.round(pathDistance / 150) + 1
    console.log('points between', pointsCount)

    const stepX = Math.round((end.x - start.x) / pointsCount)
    const stepY = Math.round((end.y - start.y) / pointsCount)

    let nowX = start.x
    let nowY = start.y

    for (let i = 0; i < pointsCount; i++) {
      nowX += stepX
      nowY += stepY
      this.#addFlag({ x: nowX, y: nowY })
    }
  }

  static getDistanceBetween2Points(
    point1: {
      x: number
      y: number
    },
    point2: {
      x: number
      y: number
    }
  ) {
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2)
  }
}
