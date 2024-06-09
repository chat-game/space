import { Village } from "../chunks"
import type { Warehouse } from "../objects/buildings/warehouse"
import type { Player } from "../objects/units"
import type { GameScene } from "../scenes/gameScene"
import { Action } from "./action"
import { ANSWER } from "$lib/game/services/actionService";

interface IDonateWoodToVillageActionOptions {
  scene: GameScene
}

export class DonateWoodToVillageAction extends Action {
  private scene: GameScene

  constructor({ scene }: IDonateWoodToVillageActionOptions) {
    super({ command: "donate", commandDescription: "!donate [quantity]" })

    this.scene = scene
    this.live = this.initLive
  }

  async initLive(player: Player, params: string[]) {
    const amount = this.scene.actionService.getAmountFromChatCommand(params[0])
    if (!amount) {
      return ANSWER.WRONG_AMOUNT_ERROR
    }

    let warehouse: Warehouse | undefined
    if (this.scene.chunkNow instanceof Village) {
      warehouse = this.scene.chunkNow.getWarehouse()
    }

    const isSuccess = await player.inventory.reduceOrDestroyItem("WOOD", amount)
    if (!isSuccess) {
      return ANSWER.NOT_ENOUGH_WOOD_ERROR
    }

    await warehouse?.inventory.addOrCreateItem("WOOD", amount)
    await player.addReputation(amount)

    return ANSWER.DONATE_WOOD_OK
  }
}
