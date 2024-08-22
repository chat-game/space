import { Bot } from '@twurple/easy-bot'
import { PubSubClient } from '@twurple/pubsub'
import { ApiClient } from '@twurple/api'
import { EventSubWsListener } from '@twurple/eventsub-ws'
import { TwitchService } from './twitch.service'
import { twitchProvider } from './twitch.provider'
import { DBRepository } from '../repository'

class TwitchController {
  readonly #channel: string
  readonly #userId: string

  readonly #service: TwitchService
  readonly #repository: DBRepository

  #bot!: Bot
  #couponGeneratorId!: ReturnType<typeof setInterval> | null

  constructor() {
    const { twitchChannelName, twitchChannelId } = useRuntimeConfig()
    this.#channel = twitchChannelName
    this.#userId = twitchChannelId

    this.#service = new TwitchService()
    this.#repository = new DBRepository()
  }

  get status() {
    return twitchProvider.isStreaming ? 'RUNNING' : 'STOPPED'
  }

  startCouponGenerator() {
    if (this.#couponGeneratorId) {
      return
    }

    this.#couponGeneratorId = setInterval(async () => {
      const coupon = await this.#repository.generateCoupon()

      await this.#bot.say(
        this.#channel,
        `Появился новый Купон! Забирай: пиши команду "!купон ${coupon.activationCommand}". Подробности на https://chatgame.space/ru/coupon :D`
      )
    }, 1000 * 60 * 25)
  }

  stopCouponGenerator() {
    if (this.#couponGeneratorId) {
      clearInterval(this.#couponGeneratorId)
      this.#couponGeneratorId = null
    }
  }

  get couponGeneratorStatus() {
    return this.#couponGeneratorId ? 'RUNNING' : 'STOPPED'
  }

  async serve() {
    const authProvider = await twitchProvider.getAuthProvider()

    const pubSubClient = new PubSubClient({ authProvider })

    pubSubClient.onRedemption(this.#userId, ({ userId, userName, rewardId, message }) => {
      this.#service.handleChannelRewardRedemption({
        userId,
        userName,
        rewardId,
        message,
      })
    })

    this.#bot = new Bot({
      authProvider,
      channels: [this.#channel],
      chatClientOptions: {
        requestMembershipEvents: true,
      },
    })

    this.#bot.onRaid(({ userName, userId, viewerCount }) => {
      void this.#service.handleRaid({ userName, userId, viewerCount })
    })

    // Handle only commands with answers
    this.#bot.onMessage(async (message) => {
      const answer = await this.#service.handleMessage({
        userId: message.userId,
        userName: message.userName,
        text: message.text,
      })
      if (answer?.message) {
        await message.reply(answer.message)
      }
    })

    setInterval(() => {
      void this.#repository.updateManaOnProfiles()
    }, 1000 * 60 * 60)
  }

  async serveStreamOnline() {
    const authProvider = await twitchProvider.getAuthProvider()

    const apiClient = new ApiClient({ authProvider })
    const listener = new EventSubWsListener({ apiClient })

    listener.start()

    listener.onStreamOnline(this.#userId, (message) => {
      log('onStreamOnline', JSON.stringify(message))
      twitchProvider.isStreaming = true
    })

    listener.onStreamOffline(this.#userId, (message) => {
      log('onStreamOffline', JSON.stringify(message))
      twitchProvider.isStreaming = false
    })
  }
}

export const twitchController = new TwitchController()
