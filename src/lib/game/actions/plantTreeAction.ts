import { PlantNewTreeScript } from '../scripts/plantNewTreeScript'
import { ANSWER } from '$lib/game/services/action/answer'
import type { Game, GameObjectPlayer } from '$lib/game/types'
import { VillageChunk } from '$lib/game/services/chunk/villageChunk'
import type { GameAction } from '$lib/game/actions/interface'

interface IPlantTreeActionOptions {
  game: Game
}

export class PlantTreeAction implements GameAction {
  command = 'plant'
  commandDescription = '!plant'
  game: Game

  constructor({ game }: IPlantTreeActionOptions) {
    this.game = game
  }

  async live(player: GameObjectPlayer) {
    if (player.script && !player.script.isInterruptible) {
      return ANSWER.BUSY_ERROR
    }

    if (this.game.chunkService.chunk instanceof VillageChunk) {
      const target = this.game.chunkService.chunk.checkIfNeedToPlantTree()
      if (!target) {
        return ANSWER.NO_SPACE_AVAILABLE_ERROR
      }

      const plantNewTreeFunc = () => {
        if (this.game.chunkService.chunk instanceof VillageChunk) {
          this.game.chunkService.chunk.plantNewTree(target)
        }
      }

      player.script = new PlantNewTreeScript({
        object: player,
        target,
        plantNewTreeFunc,
      })

      return ANSWER.OK
    }

    return ANSWER.ERROR
  }
}
