import type { CharacterEditionWithCharacter } from '@chat-game/types'
import type { GameAddon, GameObjectPlayer, PlayerService } from '../types'
import { FlagObject } from '../objects/flagObject'
import { PlayerObject } from '../objects/unit/playerObject'

export class BasePlayerService implements PlayerService {
  constructor(readonly addon: GameAddon) {}

  update() {
    // Debounce
    if (this.addon.player?.canClick === false) {
      this.addon.player.nextClick -= 1

      if (this.addon.player.nextClick <= 0) {
        this.addon.player.canClick = true
      }
    }
  }

  get activePlayers() {
    return this.addon.children.filter(
      (obj) => obj.type === 'PLAYER',
    ) as GameObjectPlayer[]
  }

  async findOrCreatePlayer(
    id: string,
    telegramId: string,
    character?: CharacterEditionWithCharacter,
  ): Promise<GameObjectPlayer> {
    const player = this.findPlayer(id)
    if (!player) {
      return this.createPlayer({ id, telegramId, character, x: 0 })
    }

    return player
  }

  findPlayer(id: string) {
    return this.addon.children.find(
      (p) => p.id === id && p.type === 'PLAYER',
    ) as PlayerObject | undefined
  }

  async createPlayer({ id, telegramId, x, character }: { id: string, telegramId: string, x: number, character?: CharacterEditionWithCharacter }) {
    const player = new PlayerObject({
      addon: this.addon,
      id,
      telegramId,
      x,
      y: this.addon.bottomY,
    })
    await player.initChar(character)

    return player
  }

  removePlayer(id: string) {
    const player = this.findPlayer(id)
    if (player) {
      player.state = 'DESTROYED'
      this.addon.removeObject(player.id)
    }
  }

  movePlayer({ id, x }: { id: string, x: number }) {
    const player = this.findPlayer(id)
    if (player) {
      const flag = new FlagObject({ addon: this.addon, x, y: this.addon.bottomY, variant: 'PLAYER_MOVEMENT' })
      if (player.target && player.target.type === 'FLAG') {
        const flag = player.target
        player.target = undefined
        flag.state = 'DESTROYED'
      }
      player.target = flag
    }

    return player
  }

  // #removeInactivePlayers() {
  //   for (const player of this.activePlayers) {
  //     const checkTime = getDateMinusMinutes(30)
  //     if (player.lastActionAt.getTime() <= checkTime.getTime()) {
  //       if (player.script) {
  //         continue
  //       }

  //       const target = this.addon.randomOutFlag
  //       const selfDestroyFunc = () => {
  //         player.state = 'DESTROYED'
  //       }

  //       player.script = new MoveOffScreenAndSelfDestroyScript({
  //         target,
  //         object: player,
  //         selfDestroyFunc,
  //       })
  //     }
  //   }
  // }
}
