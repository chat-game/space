import type { Game } from '$lib/game/types'
import type {
  GameChunk,
  GameChunkService, IGameChunkTheme,
} from '$lib/game/services/chunk/interface'
import { VillageChunk } from '$lib/game/services/chunk/villageChunk'
import { ForestChunk } from '$lib/game/services/chunk/forestChunk'
import { LakeChunk } from '$lib/game/services/chunk/lakeChunk'
import { getRandomInRange } from '$lib/utils/random'

export class ChunkService implements GameChunkService {
  chunks: GameChunk[] = []
  chunkNowId!: string
  game: Game

  constructor(game: Game) {
    this.game = game
  }

  update() {
    for (const chunk of this.chunks) {
      const isWagonOnThisChunk = chunk.isPointInArea({
        x: this.game.wagonService.wagon.x,
        y: this.game.wagonService.wagon.y,
      })
      if (isWagonOnThisChunk) {
        this.chunkNowId = chunk.id
      }

      chunk.live()
    }
  }

  get chunk() {
    return this.chunks.find((chunk) => chunk.id === this.chunkNowId)
  }

  removeChunk(chunk: GameChunk) {
    this.chunks = this.chunks.filter((c) => c.id !== chunk.id)
  }

  removeAllOutsideChunks() {
    const id = this.chunk?.id
    if (id) {
      this.chunks = this.chunks.filter((c) => c.id !== id)
    }
  }

  generateChunks(startPoint: { x: number, y: number }, amount: number) {
    let outPoint = startPoint

    for (let i = 1; i <= amount; i++) {
      const chunk = this.generateRandomChunk(outPoint)
      outPoint = chunk.randomOutPoint
      this.game.routeService.route?.addGlobalFlag(outPoint)
      this.game.routeService.addChunk(chunk)
    }

    // Generate last chunk
    const finalVillageWidth = 3600
    const finalVillage = this.generateRandomVillage({
      center: { x: outPoint.x + finalVillageWidth / 2, y: outPoint.y },
      width: finalVillageWidth,
      height: 2000,
      theme: this.getRandomTheme(),
      game: this.game,
    })
    this.chunks.push(finalVillage)

    const stopPoint = finalVillage.wagonStop
    if (stopPoint) {
      this.game.routeService.route?.addGlobalFlag({
        x: stopPoint.x,
        y: stopPoint.y,
      })
      this.game.routeService.addChunk(finalVillage)
      this.game.routeService.route?.setEndPoint({
        x: stopPoint.x,
        y: stopPoint.y,
      })
    }
  }

  generateRandomChunk(startPoint: { x: number, y: number }) {
    const random = getRandomInRange(1, 2)

    const width = getRandomInRange(2000, 3000)
    const height = getRandomInRange(2500, 3500)
    const center = {
      x: startPoint.x + width / 2,
      y: startPoint.y,
    }

    switch (random) {
      case 1:
        return this.generateRandomForest({
          center,
          width,
          height,
          theme: this.getRandomTheme(),
        })
      case 2:
        return this.generateRandomLake({
          center,
          width,
          height,
          theme: this.getRandomTheme(),
        })
    }

    return this.generateRandomForest({
      center,
      width,
      height,
      theme: this.getRandomTheme(),
    })
  }

  getRandomTheme(): IGameChunkTheme {
    const themes: IGameChunkTheme[] = [
      'GREEN',
      'BLUE',
      'STONE',
      'TEAL',
      'VIOLET',
      'TOXIC',
    ]
    return themes[Math.floor(Math.random() * themes.length)]
  }

  generateRandomVillage({
    center,
                          width,
                          height,
                          theme,
                          game,
  }: {
    center: { x: number, y: number }
    width: number
    height: number
    theme: IGameChunkTheme
    game: Game
  }): VillageChunk {
    const chunk = new VillageChunk({ width, height, center, theme, game })
    this.chunks.push(chunk)

    return chunk
  }

  generateRandomForest({
    center,
                         width,
                         height,
                         theme,
  }: {
    center: { x: number, y: number }
    width: number
    height: number
    theme: IGameChunkTheme
  }) {
    const forest = new ForestChunk({
      game: this.game,
      width,
      height,
      center,
      theme,
    })
    this.chunks.push(forest)

    return forest
  }

  generateRandomLake({
    center,
                       width,
                       height,
                       theme,
  }: {
    center: { x: number, y: number }
    width: number
    height: number
    theme: IGameChunkTheme
  }) {
    const lake = new LakeChunk({
      game: this.game,
      width,
      height,
      center,
      theme,
    })
    this.chunks.push(lake)

    return lake
  }
}
