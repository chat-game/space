import type { IGameQuest } from "$lib/game/types"
import { createId } from "@paralleldrive/cuid2"

interface IQuestOptions {
  type: IGameQuest["type"]
  title: IGameQuest["title"]
  description: IGameQuest["description"]
}

export class Quest implements IGameQuest {
  public id: string
  public type: IGameQuest["type"]
  public title: IGameQuest["title"]
  public description: IGameQuest["description"]
  public tasks: IGameQuest["tasks"]
  public status: IGameQuest["status"]
  public creatorId!: IGameQuest["creatorId"]
  public conditions!: IGameQuest["conditions"]

  constructor({ type, title, description }: IQuestOptions) {
    this.id = createId()
    this.type = type
    this.title = title
    this.description = description
    this.tasks = []

    this.status = "ACTIVE"
    this.conditions = {}
  }
}
