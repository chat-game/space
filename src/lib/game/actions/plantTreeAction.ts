import { Village } from '../chunks'
import type { Player } from '../objects/units'
import type { GameScene } from '../scenes/gameScene'
import { PlantNewTreeScript } from '../scripts/plantNewTreeScript'
import { Action } from './action'
import { ANSWER } from '$lib/game/services/actionService'

interface IPlantTreeActionOptions {
  scene: GameScene
}

export class PlantTreeAction extends Action {
  private scene: GameScene

  constructor({ scene }: IPlantTreeActionOptions) {
    super({ command: 'plant', commandDescription: '!plant' })

    this.scene = scene
    this.live = this.initLive
  }

  async initLive(player: Player) {
    if (player.script && !player.script.isInterruptible) {
      return ANSWER.BUSY_ERROR
    }

    if (this.scene.chunkNow instanceof Village) {
      const target = this.scene.chunkNow.checkIfNeedToPlantTree()
      if (!target) {
        return ANSWER.NO_SPACE_AVAILABLE_ERROR
      }

      const plantNewTreeFunc = () => {
        if (this.scene.chunkNow instanceof Village) {
          this.scene.chunkNow.plantNewTree(target)
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
