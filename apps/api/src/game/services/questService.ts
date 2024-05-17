import { createId } from "@paralleldrive/cuid2"
import {
  type IGameQuest,
  type IGameQuestTask,
  getRandomInRange,
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
      this.generateVillageQuest()
      this.generatePollForNewAdventure()
    }

    for (const event of this.scene.events) {
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
    chunks,
    limitSeconds,
    creatorId,
  }: Omit<IGameQuest, "id">): IGameQuest {
    return {
      id: createId(),
      status,
      type,
      tasks,
      chunks,
      limitSeconds,
      creatorId,
    }
  }

  public createTask(): IGameQuestTask {
    const updateProgress1: IGameQuestTask["updateProgress"] = () => {
      if (
        !this.scene.route?.flags &&
        this.scene.events.find((e) => e.type === "ADVENTURE_QUEST_STARTED")
      ) {
        return {
          status: "DONE",
        }
      }

      const items = this.scene.getWagon().cargo?.checkIfAlreadyHaveItem("WOOD")
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

    return {
      id: createId(),
      status: "ACTIVE",
      description: "Перевезти в сохранности груз",
      progressNow: 100,
      progressToSuccess: 60,
      updateProgress: updateProgress1,
    }
  }

  private updateQuestActiveTask(task: IGameQuestTask) {
    const progress = task.updateProgress(task.progressToSuccess)

    task.status = progress.status
    if (typeof progress.progressNow !== "undefined") {
      task.progressNow = progress.progressNow
    }
    if (typeof progress.progressToSuccess !== "undefined") {
      task.progressToSuccess = progress.progressToSuccess
    }
  }

  private updateAndFinishActiveQuests() {
    for (const event of this.scene.events) {
      if (!event.quest || event.quest.status !== "ACTIVE") {
        continue
      }

      // Tasks done?
      if (!event.quest.tasks.find((t) => t.status === "ACTIVE")) {
        //
        this.scene.getWagon().emptyCargo()

        if (!event.quest.tasks.find((t) => t.status === "FAILED")) {
          // Reward
          event.quest.status = "SUCCESS"
          continue
        }

        event.quest.status = "FAILED"
      }
    }
  }

  private generateVillageQuest() {
    if (!this.scene.chunkNow) {
      return
    }

    if (this.scene.chunkNow instanceof Village) {
      const store = this.scene.chunkNow.getStore()
      if (store) {
        return
      }
    }

    const villageQuests = this.scene.events.filter(
      (e) => e.type === "VILLAGE_QUEST_STARTED",
    )
    if (villageQuests.length >= 1) {
      return
    }

    const updateProgress1: IGameQuestTask["updateProgress"] = (
      progressToSuccess,
    ) => {
      if (this.scene.chunkNow instanceof Village) {
        const warehouse = this.scene.chunkNow.getWarehouse()
        if (warehouse) {
          const wood = warehouse.getItemByType("WOOD")
          if (wood?.amount) {
            if (
              typeof progressToSuccess === "number" &&
              wood.amount >= progressToSuccess
            ) {
              return {
                status: "DONE",
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
            status: "DONE",
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
      status: "ACTIVE",
      creatorId: "1",
      tasks: [
        {
          id: createId(),
          status: "ACTIVE",
          description: "Накопить 50 древесины на складе",
          progressNow: 0,
          progressToSuccess: 50,
          updateProgress: updateProgress1,
        },
        {
          id: createId(),
          status: "ACTIVE",
          description: "Построить Торговый пост",
          progressNow: false,
          progressToSuccess: true,
          updateProgress: updateProgress2,
        },
      ],
    }

    this.scene.initEvent({
      type: "VILLAGE_QUEST_STARTED",
      title: "Нет Торгового поста",
      secondsToEnd: 9999999,
      quest,
    })
  }

  generatePollForNewAdventure() {
    const trader = this.scene.getTrader()
    if (!trader) {
      return
    }

    if (this.scene.chunkNow instanceof Village) {
      const store = this.scene.chunkNow.getStore()
      if (!store) {
        return
      }
    }

    const random = getRandomInRange(1, 1500)
    if (random !== 1) {
      return
    }

    const votingEvents = this.scene.events.filter(
      (e) => e.type === "VOTING_FOR_NEW_ADVENTURE_STARTED",
    )
    if (votingEvents.length >= 1) {
      return
    }

    const adventureEvents = this.scene.events.filter(
      (e) => e.type === "ADVENTURE_QUEST_STARTED",
    )
    if (adventureEvents.length >= 1) {
      return
    }

    const votesToSuccess =
      this.scene.findActivePlayers().length >= 2
        ? this.scene.findActivePlayers().length
        : 2

    const tasks = [this.createTask()]

    this.scene.initEvent({
      type: "VOTING_FOR_NEW_ADVENTURE_STARTED",
      title: "Торговец предлагает квест",
      secondsToEnd: 180,
      quest: this.create({
        status: "INACTIVE",
        type: "MAIN",
        tasks: tasks,
        chunks: 3,
        limitSeconds: 3000,
        creatorId: trader.id,
      }),
      poll: this.scene.eventService.pollService.create(votesToSuccess),
    })
  }
}
