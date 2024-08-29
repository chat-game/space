import type { CharacterEditionWithCharacter } from '@chat-game/types'
import { PlayerObject } from '../objects/unit/playerObject'
import { MoveOffScreenAndSelfDestroyScript } from '../scripts/moveOffScreenAndSelfDestroyScript'
import { MoveToTargetScript } from '../scripts/moveToTargetScript'
import type { GameAddon, GameObjectPlayer, PlayerService } from '../types'
import { getDateMinusMinutes } from './../utils/date'

export class BasePlayerService implements PlayerService {
  constructor(readonly addon: GameAddon) {}

  update() {
    this.#removeInactivePlayers()
  }

  async init(id: string, character?: CharacterEditionWithCharacter) {
    const player = await this.#findOrCreatePlayer(id, character)

    this.addon.addChild(player)
    player.updateLastActionAt()

    const target = this.addon.randomNearFlag

    player.script = new MoveToTargetScript({
      object: player,
      target,
    })

    return player
  }

  get activePlayers() {
    return this.addon.children.filter(
      (obj) => obj.type === 'PLAYER',
    ) as GameObjectPlayer[]
  }

  async #findOrCreatePlayer(
    id: string,
    character?: CharacterEditionWithCharacter,
  ): Promise<GameObjectPlayer> {
    const player = this.#findPlayer(id)
    if (!player) {
      return this.#createPlayer(id, character)
    }

    return player
  }

  #findPlayer(id: string) {
    return this.addon.children.find(
      (p) => p.id === id && p.type === 'PLAYER',
    ) as PlayerObject | undefined
  }

  async #createPlayer(id: string, character?: CharacterEditionWithCharacter) {
    const player = new PlayerObject({
      addon: this.addon,
      id,
      x: -200,
      y: 0,
    })
    await player.init(character)

    const flag = this.addon.randomOutFlag
    player.x = flag.x
    player.y = flag.y

    return player
  }

  #removeInactivePlayers() {
    for (const player of this.activePlayers) {
      const checkTime = getDateMinusMinutes(4)
      if (player.lastActionAt.getTime() <= checkTime.getTime()) {
        if (player.script) {
          continue
        }

        const target = this.addon.randomOutFlag
        const selfDestroyFunc = () => {
          player.state = 'DESTROYED'
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
