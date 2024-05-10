import { createBotCommand } from "@twurple/easy-bot"
import type { IGameSceneAction } from "../../../../packages/api-sdk/src"
import { TWITCH_CHANNEL_REWARDS } from "../config"
import type { Game } from "../game/game"

export class BotService {
  public game: Game

  constructor(game: Game) {
    this.game = game
  }

  private buildCommand(commandName: string, action: IGameSceneAction) {
    return createBotCommand(
      commandName,
      async (params, { userId, userName, reply }) => {
        const result = await this.game.handleChatCommand({
          action,
          userId,
          userName,
          params,
        })
        if (result.message) {
          void reply(result.message)
        }
      },
    )
  }

  public commandStartChangingScene() {
    return this.buildCommand("вернуться", "START_CHANGING_SCENE")
  }

  public commandStartGroupBuild() {
    return this.buildCommand("собрать", "START_GROUP_BUILD")
  }

  public commandJoinGroup() {
    return this.buildCommand("го", "JOIN_GROUP")
  }

  public commandDisbandGroup() {
    return this.buildCommand("расформировать", "DISBAND_GROUP")
  }

  public commandStartCreatingNewAdventure() {
    return this.buildCommand("путешествовать", "START_CREATING_NEW_ADVENTURE")
  }

  public commandRefuel() {
    return this.buildCommand("заправить", "REFUEL")
  }

  public commandChop() {
    return this.buildCommand("рубить", "CHOP")
  }

  public commandMine() {
    return this.buildCommand("добыть", "MINE")
  }

  public commandGift() {
    return this.buildCommand("подарить", "GIFT")
  }

  public commandSell() {
    return this.buildCommand("продать", "SELL")
  }

  public commandBuy() {
    return this.buildCommand("купить", "BUY")
  }

  public commandHelp() {
    return this.buildCommand("помощь", "HELP")
  }

  public commandDonate() {
    return this.buildCommand("донат", "DONATE")
  }

  public reactOnMessage({
    userName,
    userId,
    text,
  }: {
    userName: string
    userId: string
    text: string
  }) {
    return this.game.handleChatCommand({
      action: "SHOW_MESSAGE",
      userId,
      userName,
      params: [text],
    })
  }

  public async reactOnRaid({
    userName,
    userId,
    viewerCount,
  }: {
    userName: string
    userId: string
    viewerCount: number
  }) {
    return this.game.handleChatCommand({
      action: "START_RAID",
      userId,
      userName,
      viewerCount,
    })
  }

  public async reactOnChannelRewardRedemption({
    userId,
    userName,
    rewardId,
  }: {
    userId: string
    userName: string
    rewardId: string
  }) {
    console.log("reactOnChannelRewardRedemption", userId, userName, rewardId)
    const player = await this.game.repository.findOrCreatePlayer(
      userId,
      userName,
    )
    if (rewardId === TWITCH_CHANNEL_REWARDS.add150ViewerPointsId) {
      await this.game.repository.addPlayerViewerPoints(player.id, 150)
      return
    }
    if (rewardId === TWITCH_CHANNEL_REWARDS.villainStealFuelId) {
      await this.game.scene.stealFuelAction(player.id)
      return
    }
  }
}
