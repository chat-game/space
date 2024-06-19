import { MoveOffScreenAndSelfDestroyScript } from '../../scripts/moveOffScreenAndSelfDestroyScript'
import { MoveToTargetScript } from '../../scripts/moveToTargetScript'
import { MoveToTradePostAndTradeScript } from '../../scripts/moveToTradePostAndTradeScript'
import { getRandomInRange } from '$lib/random'
import type {
  Game,
  GameObjectPlayer, ITradeOffer,
} from '$lib/game/types'
import { VillageChunk } from '$lib/game/services/chunk/villageChunk'
import { FlagObject } from '$lib/game/objects/flagObject'
import { Trader } from '$lib/game/objects/units/trader'
import { Poll } from '$lib/game/common/poll'
import type { GameTradeService } from '$lib/game/services/trade/interface'

export class TradeService implements GameTradeService {
  offers: ITradeOffer[] = []
  tradeWasSuccessful: boolean
  traderIsMovingWithWagon: boolean
  game: Game

  constructor(game: Game) {
    this.game = game
    this.traderIsMovingWithWagon = false
    this.tradeWasSuccessful = false
  }

  public update() {
    this.#checkAndGenerateTrader()
    this.#checkClosedOffers()
    this.#updateTrader()
  }

  getTrader() {
    return this.game.children.find((obj) => obj.type === 'TRADER')
  }

  async findActiveOfferAndTrade(
    offerId: string,
    amount: number,
    player: GameObjectPlayer,
  ) {
    for (const offer of this.offers) {
      if (offer.id === offerId) {
        const status = await this.trade(offer, amount, player)
        if (!status) {
          return 'OFFER_ERROR'
        }
        return 'OFFER_SUCCESS'
      }
    }

    return 'OFFER_NOT_FOUND'
  }

  async trade(
    offer: ITradeOffer,
    amount: number,
    player: GameObjectPlayer,
  ): Promise<boolean> {
    if (offer.amount < amount) {
      return false
    }

    if (offer.type === 'BUY') {
      const item = player.inventory.checkIfAlreadyHaveItem(offer.item)
      if (!item || item.amount < amount) {
        return false
      }

      await player.updateCoins(offer.unitPrice * amount)
      await player.inventory.reduceOrDestroyItem(item.type, amount)

      offer.amount -= amount
      return true
    }

    return false
  }

  #updateTrader() {
    const object = this.getTrader()
    if (!object) {
      return
    }

    object.live()

    if (!object.script) {
      if (this.traderIsMovingWithWagon) {
        // Moving near Wagon
        const random = getRandomInRange(1, 150)
        if (random <= 1) {
          const target = this.game.wagonService.randomNearFlag
          object.script = new MoveToTargetScript({
            object,
            target,
          })
          return
        }
      }

      // Moving to Trade
      if (this.#isNeedToStartTrade()) {
        if (this.game.chunkService.chunk instanceof VillageChunk) {
          const target = this.#getTradePointFlag()
          if (target) {
            const startTradeFunc = () => {
              this.game.eventService.initEvent({
                title: 'Trade in progress',
                description: '',
                type: 'TRADE_STARTED',
                secondsToEnd: 60 * 6,
                offers: this.offers,
              })
            }

            object.script = new MoveToTradePostAndTradeScript({
              object,
              target,
              startTradeFunc,
            })
          }
        }
      }
    }
  }

  handleTradeIsOver() {
    const trader = this.getTrader()
    if (!trader) {
      return
    }

    const target = this.game.wagonService.randomOutFlag
    const selfDestroyFunc = () => {
      this.game.removeObject(trader)
    }

    trader.script = new MoveOffScreenAndSelfDestroyScript({
      object: trader,
      target,
      selfDestroyFunc,
    })

    this.removeTrade()
  }

  public removeTrade() {
    this.offers = []
    for (const event of this.game.eventService.events) {
      if (event.type === 'TRADE_STARTED') {
        this.game.eventService.destroy(event)
      }
    }
  }

  #isNeedToStartTrade(): boolean {
    if (this.tradeWasSuccessful) {
      return false
    }

    const activeTrade = this.game.eventService.events.find(
      (e) => e.type === 'TRADE_STARTED',
    )
    return !activeTrade
  }

  #getTradePointFlag() {
    return this.game.children.find(
      (obj) => obj instanceof FlagObject && obj.variant === 'TRADE_POINT',
    ) as FlagObject | undefined
  }

  #createTradeTargetFlagNearStore() {
    if (this.#getTradePointFlag()) {
      return
    }

    const store = this.game.chunkService.chunk?.store
    if (!store) {
      return
    }

    new FlagObject({
      game: this.game,
      x: store.x + 105,
      y: store.y + 10,
      variant: 'TRADE_POINT',
    }).init()
  }

  #checkAndGenerateTrader() {
    if (this.game.chunkService.chunk instanceof VillageChunk) {
      const store = this.game.chunkService.chunk.store
      const trader = this.getTrader()
      if (store?.id && !trader?.id) {
        this.#createTradeTargetFlagNearStore()
        this.generateNewTrader()
        this.generateTradeOffers()
      }
    }
  }

  #checkClosedOffers() {
    for (const offer of this.offers) {
      if (offer.amount === 0) {
        this.tradeWasSuccessful = true
        this.removeTrade()
        this.generateNewMainQuest()
      }
    }
  }

  private generateNewTrader() {
    const { x, y } = this.game.wagonService.randomOutFlag
    new Trader({ game: this.game, x, y }).init()
  }

  private generateTradeOffers() {
    const offersAmount = 1
    const offers = []

    for (let i = 1; i <= offersAmount; i++) {
      const id = this.generateId()
      const commandToTrade = `!trade ${id}`

      const offer: ITradeOffer = {
        id,
        type: 'BUY',
        amount: 25,
        unitPrice: 1,
        item: 'WOOD',
        commandToTrade,
      }

      offers.push(offer)
    }

    this.offers.push(...offers)
    this.tradeWasSuccessful = false
  }

  private generateId(startId = 1): string {
    const id = startId
    for (const offer of this.offers) {
      if (offer.id === id.toString()) {
        const nextTry = id + 1
        return this.generateId(nextTry)
      }
    }
    return id.toString()
  }

  generateNewMainQuest() {
    const trader = this.getTrader()
    if (!trader) {
      return
    }

    const store = this.game.chunkService.chunk?.store
    if (!store) {
      return
    }

    const votingEvents = this.game.eventService.events.filter(
      (e) => e.type === 'VOTING_FOR_NEW_MAIN_QUEST_STARTED',
    )
    if (votingEvents.length >= 1) {
      return
    }

    const adventureEvents = this.game.eventService.events.filter(
      (e) => e.type === 'MAIN_QUEST_STARTED',
    )
    if (adventureEvents.length >= 1) {
      return
    }

    const votesToSuccess
      = this.game.activePlayers.length >= 2
        ? this.game.activePlayers.length
        : 1

    const poll = new Poll({ votesToSuccess, game: this.game })

    this.game.eventService.initEvent({
      type: 'VOTING_FOR_NEW_MAIN_QUEST_STARTED',
      title: 'The merchant offers a quest',
      description: 'Let\'s make the quest active? Vote in chat.',
      secondsToEnd: 180,
      quest: this.game.questService.create({
        status: 'INACTIVE',
        type: 'MAIN',
        title: 'Transport cargo to a neighboring village',
        description:
          'The merchant is worried about the safety of the items in the chest.',
        creatorId: trader.id,
        tasks: [],
        conditions: {
          chunks: getRandomInRange(3, 5),
          limitSeconds: 3000,
        },
      }),
      poll,
    })
  }
}
