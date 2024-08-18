import type {
  Game,
} from '$lib/game/types'

export interface GameService {
  game: Game
  update: () => void
}
