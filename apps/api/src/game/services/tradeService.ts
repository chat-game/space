import {
  type ITradeOffer,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src"
import { Village } from "../chunks"
import { Flag } from "../objects"
import type { Player } from "../objects/units"
import { Trader } from "../objects/units/trader"
import type { GameScene } from "../scenes"
import { MoveToRandomTargetScript } from "../scripts/moveToRandomTargetScript"
import { MoveToTradePostAndTradeScript } from "../scripts/moveToTradePostAndTradeScript"

interface ITradeServiceOptions {
  scene: GameScene
}

export class TradeService {
  public offers: ITradeOffer[] = []
  public traderIsMovingWithWagon: boolean
  public scene: GameScene

  constructor({ scene }: ITradeServiceOptions) {
    this.scene = scene
    this.traderIsMovingWithWagon = false
  }

  public update() {
    this.checkAndGenerateTrader()
    this.checkClosedOffers()
  }

  public getTrader() {
    return this.scene.objects.find((obj) => obj instanceof Trader) as
      | Trader
      | undefined
  }

  public getStore() {
    if (this.scene.chunkNow instanceof Village) {
      return this.scene.chunkNow.getStore()
    }
  }

  public async findActiveOfferAndTrade(
    offerId: string,
    amount: number,
    player: Player,
  ) {
    for (const offer of this.offers) {
      if (offer.id === offerId) {
        const status = await this.trade(offer, amount, player)
        if (!status) {
          return "OFFER_ERROR"
        }
        return "OFFER_SUCCESS"
      }
    }

    return "OFFER_NOT_FOUND"
  }

  public async trade(
    offer: ITradeOffer,
    amount: number,
    player: Player,
  ): Promise<boolean> {
    if (offer.amount < amount) {
      return false
    }

    if (offer.type === "BUY") {
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

  public updateTrader(object: Trader) {
    object.live()

    if (!object.script) {
      if (this.traderIsMovingWithWagon) {
        // Moving near Wagon
        const random = getRandomInRange(1, 150)
        if (random <= 1) {
          const target = this.scene.wagonService.findRandomNearFlag()
          object.script = new MoveToRandomTargetScript({
            object,
            target,
          })
          return
        }
      }

      // Moving to Trade
      if (this.scene.chunkNow instanceof Village) {
        const target = this.getTradePointFlag()
        if (target) {
          object.script = new MoveToTradePostAndTradeScript({
            object,
            target,
          })
          return
        }
      }
    }
  }

  private getTradePointFlag() {
    return this.scene.chunkNow?.objects.find(
      (obj) => obj instanceof Flag && obj.type === "TRADE_POINT",
    ) as Flag | undefined
  }

  private createTradeTargetFlagNearStore() {
    if (this.getTradePointFlag()) {
      return
    }

    const store = this.getStore()
    if (!store) {
      return
    }

    const flag = new Flag({
      x: store.x + 105,
      y: store.y + 10,
      type: "TRADE_POINT",
    })
    this.scene.chunkNow?.objects.push(flag)
  }

  private checkAndGenerateTrader() {
    if (this.scene.chunkNow instanceof Village) {
      const store = this.scene.chunkNow.getStore()
      const trader = this.getTrader()
      if (store?.id && !trader?.id) {
        this.createTradeTargetFlagNearStore()
        this.generateNewTrader()
        this.generateTradeOffers()
      }
    }
  }

  private checkClosedOffers() {
    for (const offer of this.offers) {
      if (offer.amount === 0) {
        this.generateNewMainQuest()
      }
    }
  }

  private generateNewTrader() {
    const { x, y } = this.scene.wagonService.findRandomOutFlag()
    const trader = new Trader({ x, y })

    this.scene.objects.push(trader)
  }

  private generateTradeOffers() {
    const offersAmount = 1
    const offers = []

    for (let i = 1; i <= offersAmount; i++) {
      const id = this.generateId()
      const commandToTrade = `!торговать ${id}`

      const offer: ITradeOffer = {
        id,
        type: "BUY",
        amount: 25,
        unitPrice: 1,
        item: "WOOD",
        commandToTrade,
      }

      offers.push(offer)
    }

    this.offers.push(...offers)

    this.scene.eventService.init({
      title: "Идет торговля",
      type: "TRADE_STARTED",
      secondsToEnd: 60 * 25,
      offers,
    })
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

    const store = this.getStore()
    if (!store) {
      return
    }

    const votingEvents = this.scene.eventService.events.filter(
      (e) => e.type === "VOTING_FOR_NEW_MAIN_QUEST_STARTED",
    )
    if (votingEvents.length >= 1) {
      return
    }

    const adventureEvents = this.scene.eventService.events.filter(
      (e) => e.type === "MAIN_QUEST_STARTED",
    )
    if (adventureEvents.length >= 1) {
      return
    }

    const votesToSuccess =
      this.scene.findActivePlayers().length >= 2
        ? this.scene.findActivePlayers().length
        : 1

    this.scene.eventService.init({
      type: "VOTING_FOR_NEW_MAIN_QUEST_STARTED",
      title: "Торговец предлагает квест",
      secondsToEnd: 180,
      quest: this.scene.eventService.questService.create({
        status: "INACTIVE",
        type: "MAIN",
        title: "Перевезти груз в деревню Б",
        description: "Торговец переживает за сохранность вещей в сундуке.",
        creatorId: trader.id,
        tasks: [],
        conditions: {
          chunks: 3,
          limitSeconds: 3000,
        },
      }),
      poll: this.scene.eventService.pollService.create(votesToSuccess),
    })
  }
}
