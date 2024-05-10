import { createId } from "@paralleldrive/cuid2"
import {
  type GameSceneType,
  type IGameEvent,
  type IGamePoll,
  getDatePlusSeconds,
} from "../../../../../packages/api-sdk/src"
import { sendMessage } from "../../websocket/websocket.server"
import { Village } from "../chunks"
import type { Game } from "../game"

interface IEventOptions {
  game: Game
  title: string
  type: IGameEvent["type"]
  secondsToEnd: number
  scene?: GameSceneType
  poll?: IGamePoll
}

export class Event implements IGameEvent {
  public id: string
  public title: string
  public type: IGameEvent["type"]
  public status: IGameEvent["status"]
  public scene?: GameSceneType
  public endsAt: Date
  public deletesAt: Date
  public poll: IGamePoll | undefined

  public game: Game

  constructor({ game, title, type, secondsToEnd, scene, poll }: IEventOptions) {
    this.game = game

    this.id = createId()
    this.title = title
    this.type = type
    this.scene = scene
    this.poll = poll
    this.endsAt = getDatePlusSeconds(secondsToEnd)
    this.deletesAt = getDatePlusSeconds(secondsToEnd + 30)
    this.status = "STARTED"

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
      if (!this.poll) {
        return
      }
      if (this.poll.votes.length >= this.poll.votesToSuccess) {
        this.game.scene.initEvent({
          type: "CREATING_NEW_ADVENTURE_STARTED",
          title: "Начинаем приключение!",
          secondsToEnd: 10,
        })
      }
    }
    if (this.type === "CREATING_NEW_ADVENTURE_STARTED") {
      const village = this.game.scene.chunkNow
      if (village instanceof Village) {
        this.game.scene.generateAdventure(village, 3)
      }
    }
  }

  public vote(player: { id: string }): boolean {
    if (!this.poll) {
      return false
    }

    if (this.poll.votes.find((v) => v.id === player.id)) {
      return false
    }

    this.poll.votes.push({ id: player.id })
    return true
  }
}
