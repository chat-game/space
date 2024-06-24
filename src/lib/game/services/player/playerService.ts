import type { Game } from '$lib/game/types'
import { Player } from '$lib/game/objects/units/player'
import type { GamePlayerService } from '$lib/game/services/player/interface'
import { getDateMinusMinutes } from '$lib/utils/date'
import {
  MoveOffScreenAndSelfDestroyScript,
} from '$lib/game/scripts/moveOffScreenAndSelfDestroyScript'

export class PlayerService implements GamePlayerService {
  game: Game

  constructor(game: Game) {
    this.game = game
  }

  update() {
    this.#removeInactivePlayers()
  }

  async findOrCreatePlayer(id: string): Promise<Player | undefined> {
    const player = this.#findPlayer(id)
    if (!player && this.game.actionService.isActionPossible('CREATE_NEW_PLAYER')) {
      return this.#createPlayer(id)
    }
    return player
  }

  #findPlayer(id: string) {
    return this.game.children.find((p) => p.id === id && p.type === 'PLAYER') as Player | undefined
  }

  async #initPlayer(id: string) {
    const instance = new Player({ game: this.game, id, x: -100, y: -100 })
    await instance.init()

    const flag = this.game.wagonService.randomOutFlag
    instance.x = flag.x
    instance.y = flag.y

    instance.init()

    return instance
  }

  async #createPlayer(id: string): Promise<Player> {
    const player = this.#findPlayer(id)
    if (!player) {
      return this.#initPlayer(id)
    }
    return player
  }

  #removeInactivePlayers() {
    const players = this.game.activePlayers
    for (const player of players) {
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
