import type { Game } from '$lib/game/types'
import { Player } from '$lib/game/objects/units/player'
import type { GamePlayerService } from '$lib/game/services/player/interface'
import { getDateMinusMinutes } from '$lib/utils/date'
import { MoveOffScreenAndSelfDestroyScript } from '$lib/game/scripts/moveOffScreenAndSelfDestroyScript'

export class PlayerService implements GamePlayerService {
  game: Game

  constructor(game: Game) {
    this.game = game
  }

  update() {
    this.#removeInactivePlayers()
  }

  async findOrCreatePlayer(id: string): Promise<Player> {
    const player = this.#findPlayer(id)
    if (!player) {
      return this.#initPlayer(id)
    }

    return player
  }

  #findPlayer(id: string) {
    return this.game.children.find((p) => p.id === id && p.type === 'PLAYER') as Player | undefined
  }

  async #initPlayer(id: string) {
    const player = new Player({ game: this.game, id, x: -100, y: -100 })
    await player.init()

    const flag = this.game.wagonService.randomOutFlag
    player.x = flag.x
    player.y = flag.y

    return player
  }

  #removeInactivePlayers() {
    for (const player of this.game.activePlayers) {
      const checkTime = getDateMinusMinutes(8)
      if (player.lastActionAt.getTime() <= checkTime.getTime()) {
        if (player.script) {
          continue
        }

        const target = this.game.wagonService.randomOutFlag
        const selfDestroyFunc = () => {
          this.game.group.remove(player)
        }

        player.script = new MoveOffScreenAndSelfDestroyScript({
          target,
          object: player,
          selfDestroyFunc,
        })
      }
    }
  }
}
