import { BaseScene } from './baseScene'
import type { Game } from '$lib/game/types'

interface IMovingSceneOptions {
  game: Game
}

export class MovingScene extends BaseScene {
  constructor({ game }: IMovingSceneOptions) {
    super({ game })

    void this.init()
  }

  async init() {
    const village = this.#initStartingVillage()
    const wagonStartPoint = village.getWagonStopPoint()

    this.wagonService.initWagon(wagonStartPoint)
    await this.#initGroupPlayers()

    // void this.live()
  }

  #initStartingVillage() {
    const initialOffsetX = 0
    const initialOffsetY = 2000
    const width = 5000
    const height = 2000
    const area = {
      width,
      height,
      center: {
        x: Math.round(width / 2 + initialOffsetX),
        y: Math.round(height / 2 + initialOffsetY),
      },
    }
    const village = this.wagonService.routeService.generateRandomVillage({
      center: area.center,
      width: area.width,
      height: area.height,
      theme: this.getRandomTheme(),
      scene: this,
    })
    this.chunks.push(village)

    return village
  }

  async #initGroupPlayers() {
    if (!this.group) {
      return
    }

    for (const player of this.group.players) {
      const instance = await this.initPlayer(player.id)
      this.objects.push(instance)
    }
  }
}
