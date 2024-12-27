import type { GameObject } from '@chat-game/types'
import { createId } from '@paralleldrive/cuid2'

interface BaseChunkOptions {
  startX: number
  endX: number
}

export class BaseChunk {
  id: string
  startX: number
  endX: number
  objects: GameObject[] = []

  constructor({ startX, endX }: BaseChunkOptions) {
    this.id = createId()
    this.startX = startX
    this.endX = endX
  }

  get width() {
    return this.endX - this.startX
  }
}
