import { ANSWER } from '$lib/game/services/actionService'
import type { Game, GameObjectPlayer } from '$lib/game/types'
import type { GameAction } from '$lib/game/actions/interface'

interface DonateWoodToVillageActionOptions {
  game: Game
}

export class DonateWoodToVillageAction implements GameAction {
  command = 'donate'
  commandDescription = '!donate [quantity]'
  game: Game

  constructor({ game }: DonateWoodToVillageActionOptions) {
    this.game = game
  }

  async live(player: GameObjectPlayer, params: string[]) {
    const amount = this.game.actionService.getAmountFromChatCommand(params[0])
    if (!amount) {
      return ANSWER.WRONG_AMOUNT_ERROR
    }

    const warehouse = this.game.chunkService.chunk?.warehouse

    const isSuccess = await player.inventory.reduceOrDestroyItem('WOOD', amount)
    if (!isSuccess) {
      return ANSWER.NOT_ENOUGH_WOOD_ERROR
    }

    await warehouse?.inventory.addOrCreateItem('WOOD', amount)
    await player.addReputation(amount)

    return ANSWER.DONATE_WOOD_OK
  }
}
