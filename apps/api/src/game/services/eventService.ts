import type {
  GameSceneType,
  IGameEvent,
  IGameQuestTask,
} from "../../../../../packages/api-sdk/src"
import { Village } from "../chunks"
import { Event } from "../common"
import type { GameScene } from "../scenes"
import { PollService } from "./pollService"
import { QuestService } from "./questService"

interface IEventServiceOptions {
  scene: GameScene
}

export class EventService {
  public events: Event[] = []
  public questService: QuestService
  public pollService: PollService
  public scene: GameScene

  constructor({ scene }: IEventServiceOptions) {
    this.scene = scene
    this.questService = new QuestService({ scene })
    this.pollService = new PollService({ scene })
  }

  public update() {
    for (const event of this.events) {
      const status = event.checkStatus()

      if (status === "STOPPED") {
        this.handleEnding(event)
        this.destroy(event)
      }

      this.updateSuccessPollsWithQuest(event)
      this.updateClosedQuests(event)
    }

    this.pollService.update()
    this.questService.update()
  }

  public init({
    title,
    type,
    secondsToEnd,
    scene,
    poll,
    quest,
    offers,
  }: {
    title: IGameEvent["title"]
    type: IGameEvent["type"]
    secondsToEnd: number
    scene?: GameSceneType
    poll?: IGameEvent["poll"]
    quest?: IGameEvent["quest"]
    offers?: IGameEvent["offers"]
  }) {
    const event = new Event({
      title,
      type,
      secondsToEnd,
      scene,
      poll,
      quest,
      offers,
    })

    this.events.push(event)
  }

  public getEvents(): IGameEvent[] {
    return this.events.map((event) => ({
      id: event.id,
      title: event.title,
      type: event.type,
      status: event.status,
      endsAt: event.endsAt,
      poll: event.poll,
      quest: event.quest,
      offers: event.offers,
    }))
  }

  public destroy(event: Event) {
    const index = this.events.indexOf(event)
    this.events.splice(index, 1)
  }

  private handleEnding(event: Event) {
    if (event.type === "SCENE_CHANGING_STARTED" && event.scene) {
      this.scene.game.initScene(event.scene)
    }
    if (event.type === "GROUP_FORM_STARTED" && event.scene) {
      this.scene.game.initScene(event.scene)
    }
    if (event.type === "RAID_STARTED") {
      this.scene.stopRaid()
    }
    if (event.type === "TRADE_STARTED") {
      this.scene.tradeService.handleTradeIsOver()
    }
    if (event.type === "VOTING_FOR_NEW_MAIN_QUEST_STARTED") {
      this.scene.tradeService.handleTradeIsOver()
    }
  }

  private destroyAllEventsWithPoll() {
    for (const event of this.events) {
      if (event.poll) {
        this.destroy(event)
      }
    }
  }

  private updateSuccessPollsWithQuest(event: Event) {
    if (event.poll?.status !== "SUCCESS" || !event.quest) {
      return
    }

    const updateProgress1: IGameQuestTask["updateProgress"] = () => {
      if (
        !this.scene.wagonService.routeService.route?.flags &&
        this.events.find((e) => e.type === "MAIN_QUEST_STARTED")
      ) {
        return {
          status: "SUCCESS",
        }
      }

      const items =
        this.scene.wagonService.wagon.cargo?.checkIfAlreadyHaveItem("WOOD")
      if (!items) {
        return {
          status: "FAILED",
          progressNow: 0,
        }
      }

      return {
        status: "ACTIVE",
        progressNow: items.amount,
      }
    }

    const tasks = [
      this.questService.createTask({
        updateProgress: updateProgress1,
        description: "Transport cargo safely",
        progressNow: 100,
        progressToSuccess: 60,
      }),
    ]

    this.init({
      title: "Journey",
      type: "MAIN_QUEST_STARTED",
      secondsToEnd: event.quest.conditions.limitSeconds ?? 9999999,
      quest: {
        ...event.quest,
        status: "ACTIVE",
        tasks,
      },
    })

    // Cargo
    this.scene.wagonService.wagon.setCargo()

    if (this.scene.chunkNow instanceof Village) {
      this.scene.wagonService.routeService.generateAdventure(
        this.scene.chunkNow,
        event.quest.conditions.chunks ?? 3,
      )
    }

    this.scene.tradeService.traderIsMovingWithWagon = true

    this.destroyAllEventsWithPoll()
  }

  private updateClosedQuests(event: Event) {
    if (event.status === "STARTED" && event.quest) {
      if (event.quest.status === "FAILED" || event.quest.status === "SUCCESS") {
        //
        event.status = "STOPPED"
      }
    }
  }
}
