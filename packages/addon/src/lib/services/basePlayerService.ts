import type { GameAddon, GameObjectPlayer, PlayerService } from '../types'
import { PlayerObject } from '../objects/unit/playerObject'
import { MoveOffScreenAndSelfDestroyScript } from '../scripts/moveOffScreenAndSelfDestroyScript'
import { MoveToTargetScript } from '../scripts/moveToTargetScript'
import { getDateMinusMinutes } from './../utils/date'

export class BasePlayerService implements PlayerService {
  constructor(readonly addon: GameAddon) {}

  update() {
    this.#removeInactivePlayers()
  }

  async init(id: string, name: string, codename?: string | null) {
    const player = await this.#findOrCreatePlayer(id, name, codename)

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
    name: string,
    codename?: string | null,
  ): Promise<GameObjectPlayer> {
    const player = this.#findPlayer(id)
    if (!player) {
      return this.#createPlayer({ id, name }, codename)
    }

    return player
  }

  #findPlayer(id: string) {
    return this.addon.children.find(
      (p) => p.id === id && p.type === 'PLAYER',
    ) as PlayerObject | undefined
  }

  async #createPlayer(player: { id: string, name: string }, codename?: string | null) {
    const playerObj = new PlayerObject({
      addon: this.addon,
      id: player.id,
      x: -200,
      y: 0,
    })
    await playerObj.init(player.name, codename)

    const flag = this.addon.randomOutFlag
    playerObj.x = flag.x
    playerObj.y = flag.y

    return playerObj
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
