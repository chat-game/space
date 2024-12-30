import type { GameObject } from '@chat-game/types'
import type { Chunk } from '../types'
import { createId } from '@paralleldrive/cuid2'

interface BaseChunkOptions {
  startX: number
  endX: number
  id?: string
}

export class BaseChunk implements Chunk {
  id: string
  width: number
  startX: number
  endX: number
  objects: GameObject[] = []

  constructor({ startX, endX, id }: BaseChunkOptions) {
    this.id = id ?? createId()

    this.width = endX - startX
    this.startX = startX
    this.endX = endX
  }
}
