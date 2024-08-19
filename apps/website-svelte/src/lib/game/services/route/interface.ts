import type { GameObjectFlag } from '$lib/game/types'
import type {
  GameChunk,
  IGameVillageChunk,
} from '$lib/game/services/chunk/interface'
import type { GameService } from '$lib/game/services/interface'

export interface GameRouteService extends GameService {
  route: IGameRoute | undefined
  nextFlag: GameObjectFlag | undefined
  addChunk: (chunk: GameChunk) => void
  generateAdventure: (village: IGameVillageChunk, chunks: number) => void
}

export interface IGameRoute {
  startPoint: { x: number, y: number }
  endPoint: { x: number, y: number }
  chunks: GameChunk[]
  addGlobalFlag: (point: { x: number, y: number }) => void
  setEndPoint: (point: { x: number, y: number }) => void
  removeFlag: (id: string) => void
}
