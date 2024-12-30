import type { GameObject } from '@chat-game/types'

export interface Chunk {
  id: string
  width: number
  startX: number
  endX: number
  objects: GameObject[]
}
