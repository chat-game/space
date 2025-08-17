import type { Container } from 'pixi.js'

export interface Game extends Container {
  id: string
}

export type ChunkTheme
  = | 'GREEN'
    | 'TOXIC'
    | 'STONE'
    | 'TEAL'
    | 'BLUE'
    | 'VIOLET'
