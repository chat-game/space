import type {
  GameObject,
  GameObjectFlag,
  IGameInventory,
} from '$lib/game/types'
import type { GameService } from '$lib/game/services/interface'

export interface GameWagonService extends GameService {
  wagon: Wagon
  cargo: IGameInventory | undefined
  randomOutFlag: GameObjectFlag
  randomNearFlag: GameObjectFlag
  initWagon: (point: { x: number, y: number }) => void
  setCargo: () => void
  emptyCargo: () => void
}

export interface Wagon extends GameObject {
  fuel: number
  visibilityArea: {
    startX: number
    endX: number
    startY: number
    endY: number
  }
  cargoType: 'CHEST' | undefined
  refuel: (woodAmount: number) => void
  emptyFuel: () => void
}
