import type { TwitchChatController } from '~~/server/utils/twitch/chat.controller'
import { createId } from '@paralleldrive/cuid2'

interface StreamChargeOptions {
  id: string
  startedAt: string
  energy: number
  rate: number
  difficulty: number
  twitchStreamName: string
}

interface StreamChargeMessage {
  id: string
  createdAt: number
  text: string
  user: string
  isExpired: boolean
}

export class StreamCharge {
  id: string
  startedAt: string
  energy: number
  rate: number
  ratePerMinute: number
  difficulty: number
  twitchStreamName: string

  messages: StreamChargeMessage[]

  energyTicker!: NodeJS.Timeout
  energyTickerInterval: number = 1000

  difficultyTicker!: NodeJS.Timeout
  difficultyTickerInterval: number = 5 * 60 * 1000
  difficultyMultiplier: number = 0.05

  messagesTicker!: NodeJS.Timeout
  messagesTickerInterval: number = 1000

  logger = useLogger('stream-charge')

  constructor(data: StreamChargeOptions, readonly twitch: TwitchChatController) {
    this.id = data.id ?? createId()
    this.startedAt = data.startedAt ?? new Date().toISOString()
    this.energy = data.energy ?? 0
    this.rate = data.rate ?? 0
    this.ratePerMinute = 0
    this.difficulty = data.difficulty ?? 0
    this.twitchStreamName = data.twitchStreamName

    this.messages = []

    this.recalculateRate()

    this.initEnergyTicker()
    this.initDifficultyTicker()
    this.initMessagesTicker()

    this.twitch.client.onMessage(this.handleMessage.bind(this))

    this.logger.success('Stream charge initialized', this.id)
  }

  calculateEnergyPerTick() {
    return this.rate / this.energyTickerInterval * this.difficulty
  }

  recalculateRate() {
    this.ratePerMinute = this.rate / this.energyTickerInterval * this.difficulty * (60_000 / this.energyTickerInterval)
  }

  initEnergyTicker() {
    this.energyTicker = setInterval(() => {
      this.recalculateRate()
      this.energy = Math.max(0, Math.min(1000, this.energy + this.calculateEnergyPerTick()))
    }, this.energyTickerInterval)
  }

  initDifficultyTicker() {
    this.difficultyTicker = setInterval(() => {
      this.difficulty += this.difficultyMultiplier
    }, this.difficultyTickerInterval)
  }

  initMessagesTicker() {
    this.messagesTicker = setInterval(() => {
      for (const message of this.messages) {
        const expiredTime = 30_000 // 30s
        const isExpired = Date.now() - message.createdAt >= expiredTime

        if (!message.isExpired && isExpired) {
          message.isExpired = true
          this.rate -= 1
        }
      }
    }, this.messagesTickerInterval)
  }

  destroy() {
    clearInterval(this.energyTicker)
    clearInterval(this.difficultyTicker)
    clearInterval(this.messagesTicker)
  }

  handleMessage(_: string, user: string, text: string) {
    this.messages.push({
      id: createId(),
      createdAt: Date.now(),
      text,
      user,
      isExpired: false,
    })

    this.rate += 1
  }
}
