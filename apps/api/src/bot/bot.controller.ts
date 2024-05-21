import { RefreshingAuthProvider } from "@twurple/auth"
import { Bot, type BotCommand } from "@twurple/easy-bot"
import { PubSubClient } from "@twurple/pubsub"
import type { TwitchAccessTokenResponse } from "../../../../packages/api-sdk/src"
import { DBRepository } from "../db/db.repository"
import type { Game } from "../game/game"
import { BotService } from "./bot.service"

export class BotController {
  private readonly channel = process.env.TWITCH_CHANNEL_NAME as string
  private readonly userId = process.env.TWITCH_CHANNEL_ID as string
  private readonly clientId = process.env.TWITCH_CLIENT_ID as string
  private readonly clientSecret = process.env.TWITCH_SECRET_ID as string
  private readonly code = process.env.TWITCH_OAUTH_CODE as string
  private readonly redirectUrl = "http://localhost:3000"

  private readonly service: BotService
  private readonly repository: DBRepository

  constructor(game: Game) {
    this.service = new BotService(game)
    this.repository = new DBRepository()
  }

  private async obtainTwitchAccessToken() {
    try {
      const response = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${this.clientId}&client_secret=${this.clientSecret}&code=${this.code}&grant_type=authorization_code&redirect_uri=${this.redirectUrl}`,
        {
          method: "POST",
        },
      )
      return (await response.json()) as TwitchAccessTokenResponse
    } catch (err) {
      console.error("obtainTwitchAccessToken", err)
      return null
    }
  }

  private async createNewAccessToken(): Promise<never> {
    const res = await this.obtainTwitchAccessToken()
    if (res?.access_token) {
      await this.repository.createTwitchAccessToken({
        userId: this.userId,
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        scope: res.scope,
        expiresIn: res.expires_in,
        obtainmentTimestamp: new Date().getTime(),
      })

      throw new Error("Saved new access token. Restart server!")
    }

    throw new Error(
      "No access token found and no Twitch code. See .env.example",
    )
  }

  private async prepareAuthProvider() {
    const accessToken = await this.repository.getTwitchAccessToken(this.userId)
    if (!accessToken) {
      return this.createNewAccessToken()
    }

    const authProvider = new RefreshingAuthProvider({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    })

    authProvider.onRefresh(async (userId, newTokenData) => {
      await this.repository.updateTwitchAccessToken(userId, newTokenData)
    })

    await authProvider.addUserForToken(accessToken, [
      "chat",
      "channel",
      "moderator",
    ])

    return authProvider
  }

  prepareBotCommands(): BotCommand[] {
    return [
      ...this.service.commandStartGroupBuild(),
      ...this.service.commandVote(),
      ...this.service.commandDisbandGroup(),
      ...this.service.commandStartChangingScene(),
      ...this.service.commandStartCreatingNewAdventure(),
      ...this.service.commandRefuel(),
      ...this.service.commandChop(),
      ...this.service.commandMine(),
      ...this.service.commandGift(),
      ...this.service.commandTrade(),
      ...this.service.commandHelp(),
      ...this.service.commandDonate(),
      ...this.service.commandGithub(),
    ]
  }

  public async serve() {
    const authProvider = await this.prepareAuthProvider()

    const pubSubClient = new PubSubClient({ authProvider })

    pubSubClient.onRedemption(this.userId, ({ userId, userName, rewardId }) => {
      this.service.reactOnChannelRewardRedemption({
        userId,
        userName,
        rewardId,
      })
    })

    const bot = new Bot({
      authProvider,
      channels: [this.channel],
      commands: this.prepareBotCommands(),
      chatClientOptions: {
        requestMembershipEvents: true,
      },
    })

    bot.onRaid(({ userName, userId, viewerCount }) => {
      void this.service.reactOnRaid({ userName, userId, viewerCount })
    })
    bot.onRaidCancel((event) => {
      console.log("raid canceled!", event)
    })

    bot.onMessage(({ userId, userName, text }) => {
      void this.service.reactOnMessage({ userName, userId, text })
    })

    bot.onJoin(({ userName }) => {
      console.log(new Date().toLocaleTimeString(), "joined!", userName)
    })
    bot.onLeave(({ userName }) => {
      console.log("left!", userName)
    })

    setInterval(
      () => {
        bot.announce(
          this.channel,
          "Базовые команды: !рубить, !добыть. Спасибо всем участникам сбора на клевый веб-сайт! :D",
          "orange",
        )
      },
      1000 * 60 * 30,
    )

    return bot
  }
}
