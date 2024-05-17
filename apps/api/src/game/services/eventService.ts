import { Village } from "../chunks"
import type { Event } from "../common"
import type { GameScene } from "../scenes"
import { PollService } from "./pollService"
import { QuestService } from "./questService"

interface IEventServiceOptions {
  scene: GameScene
}

export class EventService {
  public questService: QuestService
  public pollService: PollService
  public scene: GameScene

  constructor({ scene }: IEventServiceOptions) {
    this.scene = scene
    this.questService = new QuestService({ scene })
    this.pollService = new PollService({ scene })
  }

  public update() {
    for (const event of this.scene.events) {
      const status = event.checkStatus()

      if (status === "STOPPED") {
        event.handleEnding()

        const index = this.scene.events.indexOf(event)
        this.scene.events.splice(index, 1)
      }

      this.updateClosedPollsWithQuest(event)
      this.updateClosedQuests(event)

      // Check closed Quest
      if (event.status === "STARTED" && event.quest) {
        if (
          event.quest.status === "FAILED" ||
          event.quest.status === "SUCCESS"
        ) {
          //
          event.status = "STOPPED"
        }
      }
    }

    this.pollService.update()
    this.questService.update()
  }

  private updateClosedPollsWithQuest(event: Event) {
    if (
      event.poll?.status !== "SUCCESS" ||
      !event.quest ||
      event.quest.status !== "INACTIVE"
    ) {
      return
    }

    event.quest.status = "ACTIVE"
    event.type = "ADVENTURE_QUEST_STARTED"
    event.title = "Путешествие"
    event.setEndsAtPlusSeconds(event.quest.limitSeconds ?? 9999999)

    // Cargo
    this.scene.getWagon().setCargo()

    if (this.scene.chunkNow instanceof Village) {
      this.scene.generateAdventure(this.scene.chunkNow, event.quest.chunks ?? 3)
    }

    // Close other votes
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
