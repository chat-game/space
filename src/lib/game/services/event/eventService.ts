import { PollService } from './pollService'
import type {
  Game,
  GameSceneType,
} from '$lib/game/types'
import { Event } from '$lib/game/services/event/event'
import { VillageChunk } from '$lib/game/services/chunk/villageChunk'
import type {
  GameEventService,
  IGameEvent,
} from '$lib/game/services/event/interface'
import type {
  IGameQuestTask,
} from '$lib/game/services/quest/interface'
import type { GameAction } from '$lib/game/actions/interface'

export class EventService implements GameEventService {
  events: IGameEvent[] = []
  pollService: PollService
  game: Game

  constructor(game: Game) {
    this.game = game

    this.pollService = new PollService(this.game)
  }

  update() {
    for (const event of this.events) {
      const status = event.checkStatus()

      if (status === 'STOPPED') {
        this.#handleEnding(event)
        this.destroy(event)
      }

      this.#updateSuccessPollsWithQuest(event)
      this.#updateClosedQuests(event)
    }

    this.pollService.update()
  }

  initEvent({
    title,
    description,
    type,
    secondsToEnd,
    scene,
    poll,
    quest,
    offers,
  }: {
    title: IGameEvent['title']
    description: IGameEvent['description']
    type: IGameEvent['type']
    secondsToEnd: number
    scene?: GameSceneType
    poll?: IGameEvent['poll']
    quest?: IGameEvent['quest']
    offers?: IGameEvent['offers']
  }) {
    const event = new Event({
      title,
      description,
      type,
      secondsToEnd,
      scene,
      poll,
      quest,
      offers,
    })
    this.events.push(event)

    return event
  }

  destroy(event: IGameEvent): void {
    const index = this.events.indexOf(event)
    this.events.splice(index, 1)
  }

  findActionByCommandInPoll(command: string): GameAction | undefined {
    for (const event of this.events) {
      if (event.poll?.action && event.poll.action.command === command) {
        return event.poll?.action
      }
    }
  }

  #handleEnding(event: IGameEvent) {
    if (event.type === 'SCENE_CHANGING_STARTED' && event.scene) {
      this.game.initScene(event.scene)
    }
    if (event.type === 'GROUP_FORM_STARTED' && event.scene) {
      this.game.initScene(event.scene)
    }
    if (event.type === 'RAID_STARTED') {
      this.game.stopRaid()
    }
    if (event.type === 'TRADE_STARTED') {
      this.game.tradeService.handleTradeIsOver()
    }
    if (event.type === 'VOTING_FOR_NEW_MAIN_QUEST_STARTED') {
      this.game.tradeService.handleTradeIsOver()
    }
  }

  #destroyAllEventsWithPoll() {
    for (const event of this.events) {
      if (event.poll) {
        this.destroy(event)
      }
    }
  }

  #updateSuccessPollsWithQuest(event: IGameEvent) {
    if (event.poll?.status !== 'SUCCESS' || !event.quest) {
      return
    }

    const updateProgress1: IGameQuestTask['updateProgress'] = () => {
      if (
        !this.game.routeService.route
        && this.events.find((e) => e.type === 'MAIN_QUEST_STARTED')
      ) {
        return {
          status: 'SUCCESS',
        }
      }

      const items
        = this.game.wagonService.cargo?.checkIfAlreadyHaveItem('WOOD')
      if (!items) {
        return {
          status: 'FAILED',
          progressNow: 0,
        }
      }

      return {
        status: 'ACTIVE',
        progressNow: items.amount,
      }
    }

    const tasks = [
      this.game.questService.createTask({
        updateProgress: updateProgress1,
        description: 'Transport cargo safely',
        progressNow: 100,
        progressToSuccess: 60,
      }),
    ]

    this.initEvent({
      title: 'Journey',
      description: '',
      type: 'MAIN_QUEST_STARTED',
      secondsToEnd: event.quest.conditions.limitSeconds ?? 9999999,
      quest: {
        ...event.quest,
        status: 'ACTIVE',
        tasks,
      },
    })

    // Cargo
    this.game.wagonService.setCargo()

    if (this.game.chunkService.chunk instanceof VillageChunk) {
      this.game.routeService.generateAdventure(
        this.game.chunkService.chunk,
        event.quest.conditions.chunks ?? 3,
      )
    }

    this.game.tradeService.traderIsMovingWithWagon = true

    this.#destroyAllEventsWithPoll()
  }

  #updateClosedQuests(event: IGameEvent) {
    if (event.status === 'STARTED' && event.quest) {
      if (event.quest.status === 'FAILED' || event.quest.status === 'SUCCESS') {
        event.status = 'STOPPED'
      }
    }
  }
}
