import { createId } from "@paralleldrive/cuid2"
import {
  type GameSceneType,
  type IGameEvent,
  type IGamePoll,
  type IGameQuest,
  getDatePlusSeconds,
} from "../../../../../packages/api-sdk/src"
import { sendMessage } from "../../websocket/websocket.server"
import type { Game } from "../game"

interface IEventOptions {
  game: Game
  title: string
  type: IGameEvent["type"]
  secondsToEnd: number
  scene?: GameSceneType
  poll?: IGamePoll
  quest?: IGameQuest
}

export class Event implements IGameEvent {
  public id: string
  public title: string
  public type: IGameEvent["type"]
  public status: IGameEvent["status"]
  public scene?: GameSceneType
  public endsAt!: Date
  public deletesAt!: Date
  public poll: IGamePoll | undefined
  public quest: IGameQuest | undefined

  public game: Game

  constructor({
    game,
    title,
    type,
    secondsToEnd,
    scene,
    poll,
    quest,
  }: IEventOptions) {
    this.game = game

    this.id = createId()
    this.title = title
    this.type = type
    this.scene = scene
    this.poll = poll
    this.quest = quest
    this.status = "STARTED"

    this.setEndsAtPlusSeconds(secondsToEnd)

    sendMessage(type)
  }

  public checkStatus() {
    if (this.endsAt.getTime() <= new Date().getTime()) {
      this.status = "STOPPED"
    }
    if (this.deletesAt.getTime() <= new Date().getTime()) {
      this.status = "STOPPED"
    }

    return this.status
  }

  public handleEnding() {
    if (this.type === "SCENE_CHANGING_STARTED" && this.scene) {
      this.game.initScene(this.scene)
    }
    if (this.type === "GROUP_FORM_STARTED" && this.scene) {
      this.game.initScene(this.scene)
    }
    if (this.type === "RAID_STARTED") {
      this.game.scene.stopRaid()
    }
    if (this.type === "COUNTDOWN_NEXT_WAVE_STARTED") {
      console.log("Next wave!")
    }
    if (this.type === "VOTING_FOR_NEW_ADVENTURE_STARTED") {
      //
    }
    if (this.type === "VILLAGE_QUEST_STARTED") {
      //
    }
  }

  public setEndsAtPlusSeconds(seconds: number) {
    this.endsAt = getDatePlusSeconds(seconds)
    this.deletesAt = getDatePlusSeconds(seconds + 30)
  }
}
