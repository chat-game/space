import type { GameService } from '$lib/game/services/interface'
import type { GameAction } from '$lib/game/actions/interface'

export interface GameQuestService extends GameService {
  quests: IGameQuest[]
  create: ({
    status,
    type,
    tasks,
    conditions,
    creatorId,
    title,
    description,
  }: Omit<IGameQuest, 'id'>) => IGameQuest
  createTask: ({
    updateProgress,
    progressToSuccess,
    progressNow,
    description,
  }: Pick<
    IGameQuestTask,
    'description' | 'progressToSuccess' | 'progressNow' | 'updateProgress'
  >) => IGameQuestTask
  findActionByCommand: (command: string) => GameAction | undefined
}

export interface IGameQuest {
  id: string
  type: 'MAIN' | 'SIDE'
  title: string
  description: string
  tasks: IGameQuestTask[]
  status: 'INACTIVE' | 'ACTIVE' | 'FAILED' | 'SUCCESS'
  creatorId: string
  conditions: {
    chunks?: number
    limitSeconds?: number
    reward?: string
  }
}

export interface IGameQuestTask {
  id: string
  description: string
  status: 'INACTIVE' | 'ACTIVE' | 'FAILED' | 'SUCCESS'
  progressNow: number | boolean
  progressToSuccess: number | boolean
  updateProgress: IGameQuestTaskFunc
  command?: string
  action?: GameAction
}

export type IGameQuestTaskFunc = (
  progressToSuccess?: IGameQuestTask['progressToSuccess']
) => Partial<IGameQuestTask>
