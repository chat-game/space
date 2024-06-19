import { createId } from '@paralleldrive/cuid2'
import type { DonateWoodToVillageAction } from '../actions/donateWoodToVillageAction'
import { BaseQuest } from './baseQuest'
import type { IGameQuestTaskFunc } from '$lib/game/services/quest/interface'

interface INoTradingPostQuestOptions {
  creatorId: string
  taskUpdateFunc1: IGameQuestTaskFunc
  taskUpdateFunc2: IGameQuestTaskFunc
  taskAction1: DonateWoodToVillageAction
}

export class NoTradingPostQuest extends BaseQuest {
  constructor({
    creatorId,
    taskUpdateFunc1,
    taskUpdateFunc2,
    taskAction1,
  }: INoTradingPostQuestOptions) {
    super({
      type: 'SIDE',
      title: 'No Trading Post',
      description: 'The locals need help. Traders are expected to arrive.',
    })

    this.creatorId = creatorId
    this.#initTasks({ taskUpdateFunc1, taskUpdateFunc2, taskAction1 })
  }

  #initTasks({
    taskUpdateFunc1,
    taskUpdateFunc2,
    taskAction1,
  }: {
    taskUpdateFunc1: IGameQuestTaskFunc
    taskUpdateFunc2: IGameQuestTaskFunc
    taskAction1: DonateWoodToVillageAction
  }) {
    this.tasks = [
      {
        id: createId(),
        status: 'ACTIVE',
        description: 'Accumulate 25 wood in the warehouse',
        progressNow: 0,
        progressToSuccess: 25,
        updateProgress: taskUpdateFunc1,
        action: taskAction1,
      },
      {
        id: createId(),
        status: 'ACTIVE',
        description: 'Build Trading Post',
        progressNow: false,
        progressToSuccess: true,
        updateProgress: taskUpdateFunc2,
      },
    ]
  }
}
