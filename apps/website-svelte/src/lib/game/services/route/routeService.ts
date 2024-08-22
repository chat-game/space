import type { Game } from '$lib/game/types'
import { Route } from '$lib/game/services/route/route'
import type { GameRouteService, IGameRoute } from '$lib/game/services/route/interface'
import type { GameChunk, IGameVillageChunk } from '$lib/game/services/chunk/interface'
import { TreeObject } from '$lib/game/objects/treeObject'
import { StoneObject } from '$lib/game/objects/stoneObject'
import type { FlagObject } from '$lib/game/objects/flagObject'

export class RouteService implements GameRouteService {
  route: Route | undefined
  game: Game

  constructor(game: Game) {
    this.game = game
  }

  update() {
    if (!this.route?.flags || this.route.flags.length <= 0) {
      if (this.game.eventService.events.find((e) => e.type === 'MAIN_QUEST_STARTED')) {
        return this.#finishAdventure()
      }
    }

    if (this.route) {
      for (const flag of this.route.flags) {
        void flag.live()
      }
    }
  }

  public getRoute(): IGameRoute | null {
    if (!this.route) {
      return null
    }

    return this.route
  }

  get nextFlag(): FlagObject | undefined {
    return this.route?.flags[0]
  }

  addChunk(chunk: GameChunk) {
    this.route?.chunks.push(chunk)
  }

  generateAdventure(village: IGameVillageChunk, chunks: number): void {
    const wagonStartPoint = village.wagonStop
    const villageOutPoint = village.randomOutPoint
    if (!wagonStartPoint) {
      return
    }

    this.route = new Route({ game: this.game })
    this.route.addGlobalFlag({ x: wagonStartPoint.x, y: wagonStartPoint.y })
    this.route.startPoint = { x: wagonStartPoint.x, y: wagonStartPoint.y }
    this.addChunk(village)

    this.game.chunkService.generateChunks({ x: villageOutPoint.x, y: villageOutPoint.y }, chunks)
    this.#markObjectsAsOnWagonPath(this.route)
  }

  #markObjectsAsOnWagonPath(route: Route) {
    for (const object of this.game.children) {
      if (object instanceof TreeObject || object instanceof StoneObject) {
        const isOnPath = route.checkIfPointIsOnWagonPath({
          x: object.x,
          y: object.y,
        })
        if (isOnPath) {
          object.isOnWagonPath = true
        }
      }
    }
  }

  #finishAdventure() {
    console.log('Adventure finished!', new Date())
    this.route = undefined
    this.game.wagonService.emptyCargo()
    this.game.tradeService.traderIsMovingWithWagon = false
    this.game.tradeService.handleTradeIsOver()

    this.game.chunkService.removeAllOutsideChunks()
  }
}
