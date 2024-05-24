import type {
  GameSceneType,
  IGameSceneAction,
} from "../../../../packages/api-sdk/src"
import { DBRepository } from "../db/db.repository"
import { sendMessage } from "../websocket/websocket.server"
import {
  DefenceScene,
  type GameScene,
  MovingScene,
  VillageScene,
} from "./scenes"

interface HandleChatCommandOptions {
  action: IGameSceneAction
  userId: string // Twitch
  userName: string // Twitch
  params?: string[] // May have viewersCount or text
}

interface HandleChatCommandResponse {
  ok: boolean
  message: string | null
}

export class Game {
  public repository: DBRepository
  public scene!: GameScene

  constructor() {
    this.repository = new DBRepository()

    this.initScene("MOVING")
  }

  public async handleActionFromChat({
    action,
    userId,
    userName,
    params,
  }: HandleChatCommandOptions): Promise<HandleChatCommandResponse> {
    const player = await this.repository.findOrCreatePlayer(userId, userName)

    return this.scene.actionService.handleAction(action, player.id, params)
  }

  public initScene(scene: GameSceneType) {
    if (this.scene) {
      this.scene.destroy()
    }
    sendMessage("SCENE_CHANGED")

    if (scene === "MOVING") {
      this.scene = new MovingScene({ game: this })
      return
    }
    if (scene === "VILLAGE") {
      this.scene = new VillageScene({ game: this })
      return
    }
    if (scene === "DEFENCE") {
      this.scene = new DefenceScene({ game: this })
      return
    }
  }
}
