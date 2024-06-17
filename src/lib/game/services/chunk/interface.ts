import type { GameService } from '$lib/game/services/interface'
import type {
  Game,
  GameObjectFlag,
  GameObjectTree,
  IGameBuildingConstructionArea,
  IGameBuildingStore,
  IGameBuildingWagonStop,
  IGameBuildingWarehouse, IGameObjectArea,
} from '$lib/game/types'

export interface GameChunkService extends GameService {
  chunkNowId: string
  chunk: GameChunk | undefined
  chunks: GameChunk[]
  removeChunk: (chunk: GameChunk) => void
  removeAllOutsideChunks: () => void
  generateChunks: (startPoint: { x: number, y: number }, amount: number) => void
  generateRandomVillage: (data: {
    center: { x: number, y: number }
    width: number
    height: number
    theme: IGameChunkTheme
    game: Game
  }) => IGameVillageChunk
  getRandomTheme: () => IGameChunkTheme
}

export interface GameChunk {
  id: string
  title: string
  type: 'VILLAGE' | 'FOREST' | 'LAKE'
  center: {
    x: number
    y: number
  }
  area: IGameObjectArea
  warehouse: IGameBuildingWarehouse | undefined
  store: IGameBuildingStore | undefined
  constructionArea: IGameBuildingConstructionArea | undefined
  wagonStop: IGameBuildingWagonStop | undefined
  availableTree: GameObjectTree | undefined
  randomMovementFlag: GameObjectFlag | undefined
  randomOutPoint: { x: number, y: number }
  live: () => void
  isPointInArea: (point: { x: number, y: number }) => boolean
}

export type IGameChunkTheme =
  | 'GREEN'
  | 'TOXIC'
  | 'STONE'
  | 'TEAL'
  | 'BLUE'
  | 'VIOLET'

export interface IGameVillageChunk extends GameChunk {}

export interface IGameForestChunk extends GameChunk {}

export interface IGameLakeChunk extends GameChunk {}
