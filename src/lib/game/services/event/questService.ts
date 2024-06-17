import { createId } from '@paralleldrive/cuid2'
import { DonateWoodToVillageAction } from '../../actions/donateWoodToVillageAction'
import { PlantTreeAction } from '../../actions/plantTreeAction'
import { NoTradingPostQuest } from '../../quests/noTradingPostQuest'
import { TreesAreRunningOutQuest } from '../../quests/treesAreRunningOutQuest'
import type {
  Game, IGameQuest, IGameQuestTask, IGameQuestTaskFunc,
} from '$lib/game/types'
import { VillageChunk } from '$lib/game/services/chunk/villageChunk'
import type { GameService } from '$lib/game/services/interface'

export class QuestService implements GameService {
  game: Game

  constructor(game: Game) {
    this.game = game
  }

  update() {
    this.updateAndFinishActiveQuests()

    if (this.game.chunkService.chunk instanceof VillageChunk) {
      this.generateNewSideQuest()
    }

    for (const event of this.game.eventService.events) {
      if (!event.quest) {
        continue
      }

      for (const task of event.quest.tasks) {
        if (task.status === 'ACTIVE') {
          this.updateQuestActiveTask(task)
        }
      }
    }
  }

  public create({
    status,
    type,
    tasks,
    conditions,
    creatorId,
    title,
    description,
  }: Omit<IGameQuest, 'id'>): IGameQuest {
    return {
      id: createId(),
      status,
      title,
      description,
      type,
      tasks,
      conditions,
      creatorId,
    }
  }

  public createTask({
    updateProgress,
    progressToSuccess,
    progressNow,
    description,
  }: Pick<
    IGameQuestTask,
    'description' | 'progressToSuccess' | 'progressNow' | 'updateProgress'
  >): IGameQuestTask {
    return {
      id: createId(),
      status: 'ACTIVE',
      description,
      progressNow,
      progressToSuccess,
      updateProgress,
    }
  }

  private updateQuestActiveTask(task: IGameQuestTask) {
    const progress = task.updateProgress(task.progressToSuccess)

    if (typeof progress.status !== 'undefined') {
      task.status = progress.status
    }
    if (typeof progress.progressNow !== 'undefined') {
      task.progressNow = progress.progressNow
    }
    if (typeof progress.progressToSuccess !== 'undefined') {
      task.progressToSuccess = progress.progressToSuccess
    }
  }

  private updateAndFinishActiveQuests() {
    for (const event of this.game.eventService.events) {
      if (!event.quest || event.quest.status !== 'ACTIVE') {
        continue
      }

      // Tasks done?
      if (!event.quest.tasks.find((t) => t.status === 'ACTIVE')) {
        //
        this.game.wagonService.wagon.emptyCargo()
        this.game.tradeService.traderIsMovingWithWagon = false

        if (!event.quest.tasks.find((t) => t.status === 'FAILED')) {
          // Reward
          event.quest.status = 'SUCCESS'
          continue
        }

        event.quest.status = 'FAILED'
      }
    }
  }

  private generateSecondSideQuest() {
    const sideQuests = this.game.eventService.events.filter(
      (e) => e.type === 'SIDE_QUEST_STARTED',
    )
    if (sideQuests.length >= 1) {
      return
    }

    const taskUpdateFunc1: IGameQuestTask['updateProgress'] = () => {
      if (this.game.chunkService.chunk instanceof VillageChunk) {
        const treesAmount = this.game.chunkService.chunk.getTreesAmount()
        if (treesAmount >= 30) {
          return {
            status: 'SUCCESS',
            progressNow: treesAmount,
          }
        }

        return {
          status: 'ACTIVE',
          progressNow: treesAmount,
        }
      }

      return {
        status: 'ACTIVE',
      }
    }

    const taskAction1 = new PlantTreeAction({ game: this.game })

    const quest = new TreesAreRunningOutQuest({
      creatorId: '1',
      taskUpdateFunc1,
      taskAction1,
    })

    this.game.eventService.initEvent({
      type: 'SIDE_QUEST_STARTED',
      title: quest.title,
      description: quest.description,
      secondsToEnd: 9999999,
      quest,
    })
  }

  private generateNewSideQuest() {
    if (!this.game.chunkService.chunk) {
      return
    }

    if (this.game.chunkService.chunk instanceof VillageChunk) {
      const store = this.game.chunkService.chunk.store
      if (store) {
        const notEnough = this.game.chunkService.chunk.checkIfThereAreNotEnoughTrees()
        if (notEnough) {
          return this.generateSecondSideQuest()
        }

        return
      }
    }

    const sideQuests = this.game.eventService.events.filter(
      (e) => e.type === 'SIDE_QUEST_STARTED',
    )
    if (sideQuests.length >= 1) {
      return
    }

    const taskUpdateFunc1: IGameQuestTaskFunc = () => {
      if (this.game.chunkService.chunk instanceof VillageChunk) {
        const warehouse = this.game.chunkService.chunk.warehouse
        if (warehouse) {
          const wood = warehouse.inventory.items.find((item) => item.type === 'WOOD')
          if (wood?.amount) {
            if (wood.amount >= 25) {
              return {
                status: 'SUCCESS',
                progressNow: wood.amount,
              }
            }

            return {
              status: 'ACTIVE',
              progressNow: wood.amount,
            }
          }
        }
      }

      return {
        status: 'ACTIVE',
      }
    }

    const taskAction1 = new DonateWoodToVillageAction({ game: this.game })

    const taskUpdateFunc2: IGameQuestTaskFunc = () => {
      if (this.game.chunkService.chunk instanceof VillageChunk) {
        const store = this.game.chunkService.chunk.store
        if (store) {
          return {
            status: 'SUCCESS',
            progressNow: true,
          }
        }
      }

      return {
        status: 'ACTIVE',
        progressNow: false,
      }
    }

    const quest = new NoTradingPostQuest({
      creatorId: '1',
      taskUpdateFunc1,
      taskUpdateFunc2,
      taskAction1,
    })

    this.game.eventService.initEvent({
      type: 'SIDE_QUEST_STARTED',
      title: quest.title,
      description: quest.description,
      secondsToEnd: 9999999,
      quest,
    })
  }
}
