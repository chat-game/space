import { type BotCommand, createBotCommand } from "@twurple/easy-bot"
import type { IGameSceneAction } from "../../../../packages/api-sdk/src"
import { TWITCH_CHANNEL_REWARDS } from "../config"
import type { Game } from "../game/game"

export class BotService {
  public game: Game

  constructor(game: Game) {
    this.game = game
  }

  private buildCommand(
    commandName: string[],
    action: IGameSceneAction,
  ): BotCommand[] {
    const commands = []

    for (const command of commandName) {
      commands.push(
        createBotCommand(
          command,
          async (params, { userId, userName, reply }) => {
            const result = await this.game.handleActionFromChat({
              action,
              userId,
              userName,
              params,
            })
            if (result.message) {
              void reply(result.message)
            }
          },
        ),
      )
    }

    return commands
  }

  public commandStartChangingScene() {
    return this.buildCommand(["вернуться"], "START_CHANGING_SCENE")
  }

  public commandStartGroupBuild() {
    return this.buildCommand(["собрать"], "START_GROUP_BUILD")
  }

  public commandVote() {
    return this.buildCommand(["го"], "VOTE")
  }

  public commandDisbandGroup() {
    return this.buildCommand(["расформировать"], "DISBAND_GROUP")
  }

  public commandStartCreatingNewAdventure() {
    return this.buildCommand(["путешествовать"], "START_CREATING_NEW_ADVENTURE")
  }

  public commandRefuel() {
    return this.buildCommand(["заправить", "з"], "REFUEL")
  }

  public commandChop() {
    return this.buildCommand(["рубить", "р"], "CHOP")
  }

  public commandMine() {
    return this.buildCommand(["добыть", "добывать", "д"], "MINE")
  }

  public commandGift() {
    return this.buildCommand(["подарить"], "GIFT")
  }

  public commandTrade() {
    return this.buildCommand(["торговать"], "TRADE")
  }

  public commandHelp() {
    return this.buildCommand(["помощь", "help"], "HELP")
  }

  public commandDonate() {
    return this.buildCommand(["донат"], "DONATE")
  }

  public commandGithub() {
    return this.buildCommand(["github"], "GITHUB")
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
    return this.game.handleActionFromChat({
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
    return this.game.handleActionFromChat({
      action: "START_RAID",
      userId,
      userName,
      params: [viewerCount.toString()],
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
    console.log(
      "The viewer bought a reward using channel points",
      userId,
      userName,
      rewardId,
    )
    const player = await this.game.repository.findOrCreatePlayer(
      userId,
      userName,
    )
    if (rewardId === TWITCH_CHANNEL_REWARDS.add150ViewerPointsId) {
      await this.game.repository.addPlayerViewerPoints(player.id, 150)
      return
    }
    if (rewardId === TWITCH_CHANNEL_REWARDS.villainStealFuelId) {
      return this.game.handleActionFromChat({
        action: "STEAL_FUEL",
        userId,
        userName,
      })
    }
  }
}
