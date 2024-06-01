import { RefreshingAuthProvider } from "@twurple/auth"
import { Bot } from "@twurple/easy-bot"
import { PubSubClient } from "@twurple/pubsub"
import type { TwitchAccessTokenResponse } from "../../../../packages/api-sdk/src"
import { DONATE_URL } from "../config"
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

  public async serve() {
    const authProvider = await this.prepareAuthProvider()

    const pubSubClient = new PubSubClient({ authProvider })

    pubSubClient.onRedemption(
      this.userId,
      ({ userId, userName, rewardId, message }) => {
        this.service.handleChannelRewardRedemption({
          userId,
          userName,
          rewardId,
          message,
        })
      },
    )

    const bot = new Bot({
      authProvider,
      channels: [this.channel],
      chatClientOptions: {
        requestMembershipEvents: true,
      },
    })

    bot.onRaid(({ userName, userId, viewerCount }) => {
      void this.service.handleRaid({ userName, userId, viewerCount })
    })

    bot.onMessage(async (message) => {
      const replyText = await this.service.handleMessage({
        userId: message.userId,
        userName: message.userName,
        text: message.text,
      })
      if (replyText) {
        await message.reply(replyText)
      }
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
          `Basic commands: !chop, !mine, !help. Thanks to everyone who contributed for a cool website! :D ${DONATE_URL}`,
          "orange",
        )
      },
      1000 * 60 * 15,
    )

    return bot
  }
}
