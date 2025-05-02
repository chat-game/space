import { createId } from '@paralleldrive/cuid2'

interface StreamChargeOptions {
  id: string
  startedAt: string
  energy: number
  rate: number
  difficulty: number
}

export class StreamCharge {
  id: string
  startedAt: string
  energy: number
  rate: number
  difficulty: number

  mainTicker!: NodeJS.Timeout
  mainTickerUpdatedAt!: number
  mainTickerInterval: number = 1000

  difficultyTicker!: NodeJS.Timeout
  difficultyTickerInterval: number = 5 * 60 * 1000

  logger = useLogger('stream-charge')

  constructor(data: StreamChargeOptions) {
    this.id = data.id ?? createId()
    this.startedAt = data.startedAt ?? new Date().toISOString()
    this.energy = 100
    this.rate = -15
    this.difficulty = 1

    this.createMainTicker()
    this.createDifficultyTicker()

    this.logger.success('Stream charge initialized', this.id)
  }

  createMainTicker() {
    this.mainTickerUpdatedAt = Date.now()
    this.mainTicker = setInterval(() => {
      const now = Date.now()
      const deltaSeconds = (now - this.mainTickerUpdatedAt) / 1000
      this.mainTickerUpdatedAt = now

      const changeRateInSecond = this.rate / 1000
      this.energy = Math.max(0, Math.min(1000, this.energy + (changeRateInSecond * deltaSeconds)))

      this.logger.debug('Stream charge ticker', this.energy)
    }, this.mainTickerInterval)
  }

  createDifficultyTicker() {
    this.difficultyTicker = setInterval(() => {
      const timeMs = Math.floor((Date.now() - new Date(this.startedAt).getTime()))
      const timeBlock = Math.floor(timeMs / this.difficultyTickerInterval)
      this.difficulty += timeBlock
    }, this.difficultyTickerInterval)
  }

  destroy() {
    clearInterval(this.mainTicker)
    clearInterval(this.difficultyTicker)
  }
}
