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
}

export class StreamCharge {
  id: string
  startedAt: string
  energy: number
  rate: number
  difficulty: number
  twitchStreamName: string

  messages: StreamChargeMessage[]

  mainTicker!: NodeJS.Timeout
  mainTickerInterval: number = 1000

  difficultyTicker!: NodeJS.Timeout
  difficultyTickerInterval: number = 5 * 60 * 1000
  difficultyMultiplier: number = 0.10

  messagesTicker!: NodeJS.Timeout
  messagesTickerInterval: number = 1000

  logger = useLogger('stream-charge')

  constructor(data: StreamChargeOptions, readonly twitch: TwitchChatController) {
    this.id = data.id ?? createId()
    this.startedAt = data.startedAt ?? new Date().toISOString()
    this.energy = data.energy ?? 0
    this.rate = data.rate ?? 0
    this.difficulty = data.difficulty ?? 0
    this.twitchStreamName = data.twitchStreamName

    this.messages = []

    this.initMainTicker()
    this.initDifficultyTicker()
    this.initMessagesTicker()

    this.twitch.client.onMessage(this.handleMessage.bind(this))

    this.logger.success('Stream charge initialized', this.id)
  }

  initMainTicker() {
    this.mainTicker = setInterval(() => {
      const addTo = this.energy + (this.rate / 1000 * this.difficulty)
      this.energy = Math.max(0, Math.min(1000, addTo))

      this.logger.debug('Stream charge ticker', this.energy)
    }, this.mainTickerInterval)
  }

  initDifficultyTicker() {
    this.difficultyTicker = setInterval(() => {
      this.difficulty += this.difficultyMultiplier
    }, this.difficultyTickerInterval)
  }

  initMessagesTicker() {
    this.messagesTicker = setInterval(() => {
      for (const message of this.messages) {
        const expiredTime = 1000 * 20 // 20s

        if (Date.now() - message.createdAt >= expiredTime) {
          this.messages = this.messages.filter((m) => m.id !== message.id)
          this.rate -= 1
        }
      }
    }, this.messagesTickerInterval)
  }

  destroy() {
    clearInterval(this.mainTicker)
    clearInterval(this.difficultyTicker)
    clearInterval(this.messagesTicker)
  }

  handleMessage(_: string, user: string, text: string) {
    this.messages.push({
      id: createId(),
      createdAt: Date.now(),
      text,
      user,
    })

    this.rate += 1
  }
}
