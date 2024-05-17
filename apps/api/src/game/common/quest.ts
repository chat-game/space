import { createId } from "@paralleldrive/cuid2"
import type { IGameQuest } from "../../../../../packages/api-sdk/src"

export class Quest implements IGameQuest {
  public id: string
  public type: IGameQuest["type"]
  public tasks: IGameQuest["tasks"]
  public status!: IGameQuest["status"]
  public creatorId!: IGameQuest["creatorId"]

  constructor() {
    this.id = createId()
    this.tasks = []
  }
}
