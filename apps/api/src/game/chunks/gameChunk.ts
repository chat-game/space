import { createId } from "@paralleldrive/cuid2"
import {
  type IGameChunk,
  type IGameChunkTheme,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src"
import { Area, type GameObject } from "../objects"

interface IGameChunkOptions {
  center: IGameChunk["center"]
  title: IGameChunk["title"]
  type: IGameChunk["type"]
  theme: IGameChunkTheme
  width: number
  height: number
}

export class GameChunk implements IGameChunk {
  public id: string
  public title: string
  public type: IGameChunk["type"]
  public center!: IGameChunk["center"]
  public area!: Area
  public isVisibleOnClient = false

  public needToSendDataToClient: boolean
  public objects: GameObject[] = []

  constructor({
    title,
    type,
    theme,
    width,
    height,
    center,
  }: IGameChunkOptions) {
    this.id = createId()
    this.center = center
    this.title = title
    this.type = type

    this.needToSendDataToClient = false

    this.initArea({ width, height, theme })
  }

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

    this.area = new Area({ theme, area })
  }

  public live() {
    for (const obj of this.objects) {
      obj.isVisibleOnClient = this.isVisibleOnClient
      obj.needToSendDataToClient = this.needToSendDataToClient
    }
    this.area.isVisibleOnClient = this.isVisibleOnClient
    this.area.needToSendDataToClient = this.needToSendDataToClient
    this.area.live()
  }

  public getRandomPoint() {
    return {
      x: getRandomInRange(this.area.area.startX, this.area.area.endX),
      y: getRandomInRange(this.area.area.startY, this.area.area.endY),
    }
  }

  public getRandomOutPointOnRight() {
    const height = this.area.area.endY - this.area.area.startY

    return {
      x: this.area.area.endX,
      y: getRandomInRange(
        this.area.area.startY + Math.round(height / 2),
        this.area.area.endY,
      ),
    }
  }

  public checkIfPointIsInArea(point: { x: number; y: number }): boolean {
    if (point.x >= this.area.area.startX && point.x <= this.area.area.endX) {
      if (point.y >= this.area.area.startY && point.y <= this.area.area.endY) {
        return true
      }
    }

    return false
  }
}
