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
  mainTickerInterval: number = 1000

  difficultyTicker!: NodeJS.Timeout
  difficultyTickerInterval: number = 5 * 60 * 1000

  logger = useLogger('stream-charge')

  constructor(data: StreamChargeOptions) {
    this.id = data.id ?? createId()
    this.startedAt = data.startedAt ?? new Date().toISOString()
    this.energy = data.energy ?? 0
    this.rate = data.rate ?? 0
    this.difficulty = data.difficulty ?? 0

    this.createMainTicker()
    this.createDifficultyTicker()

    this.logger.success('Stream charge initialized', this.id)
  }

  createMainTicker() {
    this.mainTicker = setInterval(() => {
      const addTo = this.energy + (this.rate / 1000 * this.difficulty)
      this.energy = Math.max(0, Math.min(1000, addTo))

      this.logger.debug('Stream charge ticker', this.energy)
    }, this.mainTickerInterval)
  }

  createDifficultyTicker() {
    this.difficultyTicker = setInterval(() => {
      this.difficulty += 0.25
    }, this.difficultyTickerInterval)
  }

  destroy() {
    clearInterval(this.mainTicker)
    clearInterval(this.difficultyTicker)
  }
}
