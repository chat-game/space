import { Village } from '../chunks'
import { PlantNewTreeScript } from '../scripts/plantNewTreeScript'
import { BaseAction } from './baseAction'
import { ANSWER } from '$lib/game/scenes/services/actionService'
import type { GameScene } from '$lib/game/types'

interface IPlantTreeActionOptions {
  scene: GameScene
}

export class PlantTreeAction extends BaseAction {
  scene: GameScene

  constructor({ scene }: IPlantTreeActionOptions) {
    super({ command: 'plant', commandDescription: '!plant' })

    this.scene = scene
  }

  async live(player) {
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
