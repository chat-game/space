import { createId } from "@paralleldrive/cuid2"
import type {
  IGameQuest,
  IGameQuestTask,
} from "../../../../../packages/api-sdk/src"
import { Village } from "../chunks"
import type { GameScene } from "../scenes"

interface IQuestServiceOptions {
  scene: GameScene
}

export class QuestService {
  public scene: GameScene

  constructor({ scene }: IQuestServiceOptions) {
    this.scene = scene
  }

  public update() {
    this.updateAndFinishActiveQuests()

    if (this.scene.chunkNow instanceof Village) {
      this.generateNewSideQuest()
    }

    for (const event of this.scene.eventService.events) {
      if (!event.quest) {
        continue
      }

      for (const task of event.quest.tasks) {
        if (task.status === "ACTIVE") {
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
  }: Omit<IGameQuest, "id">): IGameQuest {
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
    "description" | "progressToSuccess" | "progressNow" | "updateProgress"
  >): IGameQuestTask {
    return {
      id: createId(),
      status: "ACTIVE",
      description,
      progressNow,
      progressToSuccess,
      updateProgress,
    }
  }

  private updateQuestActiveTask(task: IGameQuestTask) {
    const progress = task.updateProgress(task.progressToSuccess)

    if (typeof progress.status !== "undefined") {
      task.status = progress.status
    }
    if (typeof progress.progressNow !== "undefined") {
      task.progressNow = progress.progressNow
    }
    if (typeof progress.progressToSuccess !== "undefined") {
      task.progressToSuccess = progress.progressToSuccess
    }
  }

  private updateAndFinishActiveQuests() {
    for (const event of this.scene.eventService.events) {
      if (!event.quest || event.quest.status !== "ACTIVE") {
        continue
      }

      // Tasks done?
      if (!event.quest.tasks.find((t) => t.status === "ACTIVE")) {
        //
        this.scene.wagonService.wagon.emptyCargo()
        this.scene.tradeService.traderIsMovingWithWagon = false

        if (!event.quest.tasks.find((t) => t.status === "FAILED")) {
          // Reward
          event.quest.status = "SUCCESS"
          continue
        }

        event.quest.status = "FAILED"
      }
    }
  }

  private generateSecondSideQuest() {
    const sideQuests = this.scene.eventService.events.filter(
      (e) => e.type === "SIDE_QUEST_STARTED",
    )
    if (sideQuests.length >= 1) {
      return
    }

    const updateProgress1: IGameQuestTask["updateProgress"] = () => {
      if (this.scene.chunkNow instanceof Village) {
        const treesAmount = this.scene.chunkNow.getTreesAmount()
        if (treesAmount >= 30) {
          return {
            status: "SUCCESS",
            progressNow: treesAmount,
          }
        }

        return {
          status: "ACTIVE",
          progressNow: treesAmount,
        }
      }

      return {
        status: "ACTIVE",
      }
    }

    const quest: IGameQuest = {
      id: createId(),
      type: "SIDE",
      title: "The trees are running out!",
      description:
        "In the village, someone is actively cutting down trees. Help is needed!",
      status: "ACTIVE",
      creatorId: "1",
      conditions: {},
      tasks: [
        {
          id: createId(),
          status: "ACTIVE",
          description: "There must be 30 trees",
          progressNow: 0,
          progressToSuccess: 30,
          updateProgress: updateProgress1,
          command: "!plant",
        },
      ],
    }

    this.scene.eventService.init({
      type: "SIDE_QUEST_STARTED",
      title: "The trees are running out!",
      secondsToEnd: 9999999,
      quest,
    })
  }

  private generateNewSideQuest() {
    if (!this.scene.chunkNow) {
      return
    }

    if (this.scene.chunkNow instanceof Village) {
      const store = this.scene.chunkNow.getStore()
      if (store) {
        const notEnough = this.scene.chunkNow.checkIfThereAreNotEnoughTrees()
        if (notEnough) {
          return this.generateSecondSideQuest()
        }

        return
      }
    }

    const sideQuests = this.scene.eventService.events.filter(
      (e) => e.type === "SIDE_QUEST_STARTED",
    )
    if (sideQuests.length >= 1) {
      return
    }

    const updateProgress1: IGameQuestTask["updateProgress"] = () => {
      if (this.scene.chunkNow instanceof Village) {
        const warehouse = this.scene.chunkNow.getWarehouse()
        if (warehouse) {
          const wood = warehouse.getItemByType("WOOD")
          if (wood?.amount) {
            if (wood.amount >= 25) {
              return {
                status: "SUCCESS",
                progressNow: wood.amount,
              }
            }

            return {
              status: "ACTIVE",
              progressNow: wood.amount,
            }
          }
        }
      }

      return {
        status: "ACTIVE",
      }
    }

    const updateProgress2: IGameQuestTask["updateProgress"] = () => {
      if (this.scene.chunkNow instanceof Village) {
        const store = this.scene.chunkNow.getStore()
        if (store) {
          return {
            status: "SUCCESS",
            progressNow: true,
          }
        }
      }

      return {
        status: "ACTIVE",
        progressNow: false,
      }
    }

    const quest: IGameQuest = {
      id: createId(),
      type: "SIDE",
      title: "No Trading Post",
      description: "The locals need help. Traders are expected to arrive.",
      status: "ACTIVE",
      creatorId: "1",
      conditions: {},
      tasks: [
        {
          id: createId(),
          status: "ACTIVE",
          description: "Accumulate 25 wood in the warehouse",
          progressNow: 0,
          progressToSuccess: 25,
          updateProgress: updateProgress1,
          command: "!donate wood [quantity]",
        },
        {
          id: createId(),
          status: "ACTIVE",
          description: "Build Trading Post",
          progressNow: false,
          progressToSuccess: true,
          updateProgress: updateProgress2,
        },
      ],
    }

    this.scene.eventService.init({
      type: "SIDE_QUEST_STARTED",
      title: "No Trading Post",
      secondsToEnd: 9999999,
      quest,
    })
  }
}
