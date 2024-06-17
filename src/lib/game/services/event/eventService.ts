import { PollService } from './pollService'
import { QuestService } from './questService'
import type {
  Game,
  GameSceneType, IGamePoll, IGameQuest, IGameQuestTask,
} from '$lib/game/types'
import { Event } from '$lib/game/services/event/event'
import { VillageChunk } from '$lib/game/services/chunk/villageChunk'
import type {
  GameEventService, IGameEvent,
} from '$lib/game/services/interface'

export class EventService implements GameEventService {
  events: Event[] = []
  questService: QuestService
  pollService: PollService
  game: Game

  constructor(game: Game) {
    this.game = game

    this.questService = new QuestService(this.game)
    this.pollService = new PollService(this.game)
  }

  update() {
    for (const event of this.events) {
      const status = event.checkStatus()

      if (status === 'STOPPED') {
        this.handleEnding(event)
        this.destroy(event)
      }

      this.updateSuccessPollsWithQuest(event)
      this.updateClosedQuests(event)
    }

    this.pollService.update()
    this.questService.update()
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

  prepareQuestData(quest: IGameQuest | undefined) {
    if (!quest) {
      return
    }

    const tasks = quest?.tasks.map((t) => {
      const action = t.action
        ? {
            ...t.action,
            live: undefined,
            scene: undefined,
          }
        : undefined
      return { ...t, action }
    })

    return {
      ...quest,
      tasks,
    }
  }

  preparePollData(poll: IGamePoll | undefined) {
    if (!poll) {
      return
    }

    return {
      ...poll,
      action: {
        ...poll.action,
        poll: undefined,
        live: undefined,
        scene: undefined,
      },
      scene: undefined,
    }
  }

  public destroy(event: Event) {
    const index = this.events.indexOf(event)
    this.events.splice(index, 1)
  }

  public findActionByCommandInQuest(command: string) {
    for (const event of this.events) {
      if (event.quest?.tasks) {
        const task = event.quest.tasks.find(
          (q) => q.action?.command === command,
        )
        if (task?.action) {
          return task.action
        }
      }
    }
  }

  public findActionByCommandInPoll(command: string) {
    for (const event of this.events) {
      if (event.poll?.action && event.poll.action.command === command) {
        return event.poll?.action
      }
    }
  }

  private handleEnding(event: Event) {
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

  private destroyAllEventsWithPoll() {
    for (const event of this.events) {
      if (event.poll) {
        this.destroy(event)
      }
    }
  }

  private updateSuccessPollsWithQuest(event: Event) {
    if (event.poll?.status !== 'SUCCESS' || !event.quest) {
      return
    }

    const updateProgress1: IGameQuestTask['updateProgress'] = () => {
      if (
        !this.game.routeService.route?.flags
        && this.events.find((e) => e.type === 'MAIN_QUEST_STARTED')
      ) {
        return {
          status: 'SUCCESS',
        }
      }

      const items
        = this.game.wagonService.wagon.cargo?.checkIfAlreadyHaveItem('WOOD')
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
      this.questService.createTask({
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
    this.game.wagonService.wagon.setCargo()

    if (this.game.chunkService.chunk instanceof VillageChunk) {
      this.game.routeService.generateAdventure(
        this.game.chunkService.chunk,
        event.quest.conditions.chunks ?? 3,
      )
    }

    this.game.tradeService.traderIsMovingWithWagon = true

    this.destroyAllEventsWithPoll()
  }

  private updateClosedQuests(event: Event) {
    if (event.status === 'STARTED' && event.quest) {
      if (event.quest.status === 'FAILED' || event.quest.status === 'SUCCESS') {
        //
        event.status = 'STOPPED'
      }
    }
  }
}
