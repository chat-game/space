import type { Game, GameScene } from '$lib/game/types'

interface IMovingSceneOptions {
  game: Game
}

export class MovingScene implements GameScene {
  game: Game

  constructor({ game }: IMovingSceneOptions) {
    this.game = game
    void this.#init()
  }

  destroy() {}

  async #init() {
    const village = this.#initStartingVillage()
    const wagonStop = village.wagonStop
    if (!wagonStop) {
      return
    }

    this.game.wagonService.initWagon({ x: wagonStop.x, y: wagonStop.y })
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
    const village = this.game.chunkService.generateRandomVillage({
      center: area.center,
      width: area.width,
      height: area.height,
      theme: this.game.chunkService.getRandomTheme(),
      game: this.game,
    })
    this.game.chunkService.chunks.push(village)

    return village
  }
}
