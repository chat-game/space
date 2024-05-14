import { RefreshingAuthProvider } from "@twurple/auth"
import { Bot, type BotCommand } from "@twurple/easy-bot"
import { PubSubClient } from "@twurple/pubsub"
import type { Game } from "../game/game"
import { BotService } from "./bot.service"

export class BotController {
  private readonly channel = process.env.TWITCH_CHANNEL_NAME as string
  private readonly userId = process.env.TWITCH_CHANNEL_ID as string
  private readonly clientId = process.env.TWITCH_CLIENT_ID as string
  private readonly clientSecret = process.env.TWITCH_SECRET_ID as string

  private readonly service: BotService

  constructor(game: Game) {
    this.service = new BotService(game)
  }

  private async prepareAuthProvider() {
    const tokenFile = Bun.file(`./apps/api/tmp/${this.userId}.token.json`)
    const tokenData = await tokenFile.json()

    const authProvider = new RefreshingAuthProvider({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    })

    authProvider.onRefresh(async (_, newTokenData) => {
      const data = JSON.stringify(newTokenData, null, 4)
      await Bun.write(tokenFile, data)
    })

    await authProvider.addUserForToken(tokenData, ["chat", "channel"])

    return authProvider
  }

  prepareBotCommands(): BotCommand[] {
    return [
      ...this.service.commandStartGroupBuild(),
      ...this.service.commandJoinGroup(),
      ...this.service.commandDisbandGroup(),
      ...this.service.commandStartChangingScene(),
      ...this.service.commandStartCreatingNewAdventure(),
      ...this.service.commandRefuel(),
      ...this.service.commandChop(),
      ...this.service.commandMine(),
      ...this.service.commandGift(),
      ...this.service.commandSell(),
      ...this.service.commandBuy(),
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

    bot.onRaid(({ broadcasterName, userName, userId, viewerCount }) => {
      void bot.say(broadcasterName, `@${userName} устроил(а) рейд! Готовимся!`)
      void this.service.reactOnRaid({ userName, userId, viewerCount })
    })
    bot.onRaidCancel((event) => {
      console.log("raid canceled!", event)
    })

    bot.onMessage(({ userId, userName, text }) => {
      void this.service.reactOnMessage({ userName, userId, text })
    })

    bot.onAction(({ userId, userName, isAction, text }) => {
      console.log("action!", userId, userName, isAction, text)
    })

    bot.onJoin(({ userName }) => {
      console.log(new Date().toLocaleTimeString(), "joined!", userName)
    })
    bot.onLeave(({ userName }) => {
      console.log("left!", userName)
    })

    bot.onSub(({ broadcasterName, userName }) => {
      void bot.say(
        broadcasterName,
        `Thanks to @${userName} for subscribing to the channel!`,
      )
    })
    bot.onResub(({ broadcasterName, userName, months }) => {
      void bot.say(
        broadcasterName,
        `Thanks to @${userName} for subscribing to the channel for a total of ${months} months!`,
      )
    })
    bot.onSubGift(({ broadcasterName, gifterName, userName }) => {
      void bot.say(
        broadcasterName,
        `Thanks to @${gifterName} for gifting a subscription to @${userName}!`,
      )
    })

    return bot
  }
}
