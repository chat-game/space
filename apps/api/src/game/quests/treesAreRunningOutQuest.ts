import { createId } from '@paralleldrive/cuid2'
import type { IGameQuestTaskFunc } from '../../../../../packages/api-sdk/src'
import type { PlantTreeAction } from '../actions/plantTreeAction'
import { Quest } from './quest'

interface ITreesAreRunningOutQuestOptions {
  creatorId: string
  taskUpdateFunc1: IGameQuestTaskFunc
  taskAction1: PlantTreeAction
}

export class TreesAreRunningOutQuest extends Quest {
  constructor({
    creatorId,
    taskUpdateFunc1,
    taskAction1,
  }: ITreesAreRunningOutQuestOptions) {
    super({
      type: 'SIDE',
      title: 'The trees are running out!',
      description:
        'In the village, someone is actively cutting down trees. Help is needed!',
    })

    this.creatorId = creatorId
    this.initTasks({ taskUpdateFunc1, taskAction1 })
  }

  initTasks({
    taskUpdateFunc1,
    taskAction1,
  }: {
    taskUpdateFunc1: IGameQuestTaskFunc
    taskAction1: PlantTreeAction
  }) {
    this.tasks = [
      {
        id: createId(),
        status: 'ACTIVE',
        description: 'There should be at least 30 trees',
        progressNow: 0,
        progressToSuccess: 30,
        updateProgress: taskUpdateFunc1,
        action: taskAction1,
      },
    ]
  }
}
