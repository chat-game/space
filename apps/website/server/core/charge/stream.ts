import type { DonationAlertsDonationEvent } from '@donation-alerts/events'
import type { TwitchChatController } from '~~/server/utils/twitch/chat.controller'
import type { ChargeModifier } from '~~/types/charge'
import type { DonateController } from '../donate/controller'
import { createId } from '@paralleldrive/cuid2'

interface StreamChargeOptions {
  id: string
  startedAt: string
  energy: number
  rate: number
  difficulty: number
  twitchStreamId: string
  twitchStreamName: string
}

interface StreamChargeMessage {
  id: string
  createdAt: number
  text: string
  userName: string
  isExpired: boolean
}

interface StreamChargeDonation {
  id: string
  createdAt: number
  amount: number
  userName: string
  message: string
}

export class StreamCharge {
  id: string
  startedAt: string
  energy: number
  rate: number
  ratePerMinute: number
  difficulty: number
  twitchStreamId: string
  twitchStreamName: string

  messages: StreamChargeMessage[] = []
  donations: StreamChargeDonation[] = []
  modifiers: ChargeModifier[] = []

  energyTicker!: NodeJS.Timeout
  energyTickerInterval: number = 1000

  difficultyTicker!: NodeJS.Timeout
  difficultyTickerInterval: number = 5 * 60 * 1000
  difficultyMultiplier: number = 0.05

  messagesTicker!: NodeJS.Timeout
  messagesTickerInterval: number = 1000

  modifiersTicker!: NodeJS.Timeout
  modifiersTickerInterval: number = 1000

  readonly #logger = useLogger('stream-charge')

  constructor(
    data: StreamChargeOptions,
    readonly chat: TwitchChatController,
    readonly sub: TwitchSubController,
    readonly donate: DonateController,
  ) {
    this.id = data.id ?? createId()
    this.startedAt = data.startedAt ?? new Date().toISOString()
    this.energy = data.energy ?? 0
    this.rate = data.rate ?? 0
    this.ratePerMinute = 0
    this.difficulty = data.difficulty ?? 0
    this.twitchStreamId = data.twitchStreamId
    this.twitchStreamName = data.twitchStreamName

    this.recalculateRate()

    this.initEnergyTicker()
    this.initDifficultyTicker()
    this.initMessagesTicker()
    this.initModifiersTicker()

    this.initChatClient()
    this.initSubClient()
    this.initDonateClient()

    this.#logger.success('Stream charge initialized', this.id)
  }

  get energyPerTick() {
    return this.getRateWithModifier(this.rate) / this.energyTickerInterval * this.difficulty
  }

  getRateWithModifier(rate: number) {
    let updatedRate = rate

    for (const modifier of this.modifiers) {
      if (modifier.isExpired) {
        continue
      }

      if (modifier.code === 'positive1') {
        updatedRate += 2
      }
      if (modifier.code === 'positive2') {
        updatedRate += 5
      }
      if (modifier.code === 'positive3') {
        updatedRate += Math.abs(this.rate)
      }
      if (modifier.code === 'negative1') {
        updatedRate -= 2
      }
      if (modifier.code === 'negative2') {
        updatedRate -= 5
      }
      if (modifier.code === 'negative3') {
        updatedRate -= Math.abs(this.rate)
      }
    }

    return updatedRate
  }

  expireAllModifiers() {
    for (const modifier of this.modifiers) {
      modifier.isExpired = true
    }
  }

  recalculateRate() {
    this.ratePerMinute = this.energyPerTick * (60_000 / this.energyTickerInterval)
  }

  initEnergyTicker() {
    this.energyTicker = setInterval(() => {
      this.recalculateRate()
      this.energy = Math.max(0, Math.min(1000, this.energy + this.energyPerTick))
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

  initModifiersTicker() {
    this.modifiersTicker = setInterval(() => {
      for (const modifier of this.modifiers) {
        const isExpired = Date.now() >= modifier.expiredAt
        if (!modifier.isExpired && isExpired) {
          modifier.isExpired = true
        }
      }
    }, this.modifiersTickerInterval)
  }

  initChatClient() {
    this.chat.client.onMessage(this.handleMessage.bind(this))
  }

  initSubClient() {
    this.sub.init().then(() => {
      this.sub.client.onChannelRedemptionAdd(this.twitchStreamId, this.handleRedemption.bind(this))
    })
  }

  initDonateClient() {
    this.donate.init().then(() => {
      this.donate.client.onDonation(this.handleDonation.bind(this))
    })
  }

  destroy() {
    clearInterval(this.energyTicker)
    clearInterval(this.difficultyTicker)
    clearInterval(this.messagesTicker)
    clearInterval(this.modifiersTicker)
  }

  handleMessage(_: string, userName: string, text: string) {
    this.messages.push({
      id: createId(),
      createdAt: Date.now(),
      text,
      userName,
      isExpired: false,
    })

    this.rate += 1
  }

  handleRedemption(data: { rewardId: string, userId: string, userName: string, rewardTitle: string }) {
    this.#logger.log('The viewer bought a reward using channel points', data.rewardId, data.userId, data.userName, data.rewardTitle)

    const reward = TWITCH_CHANNEL_REWARDS.find((reward) => reward.rewardId === data.rewardId)
    if (!reward) {
      return
    }

    // Instant energy
    if (reward.code === 'positive4') {
      this.energy += 5
    }
    if (reward.code === 'negative4') {
      this.energy -= 5
    }

    // Neutral
    if (reward.code === 'neutral1') {
      this.expireAllModifiers()
    }

    const modifier: ChargeModifier = {
      id: createId(),
      createdAt: Date.now(),
      expiredAt: Date.now() + reward.actionTimeInSeconds * 1000,
      code: reward.code,
      userName: data.userName,
      isExpired: false,
    }

    this.modifiers.push(modifier)
  }

  handleDonation(event: DonationAlertsDonationEvent) {
    this.#logger.log('The viewer donated', event.username, event.amount, event.currency, event.message)

    function convertByCurrency(currency: string, amount: number): number {
      if (currency === 'RUB') {
        // 1 RUB = 0.1 energy
        return amount * 0.1
      }
      if (currency === 'USD') {
        // 1 USD = 10 energy
        return amount * 10
      }
      return amount
    }

    const amount = convertByCurrency(event.currency, event.amount)
    this.energy += amount

    const donation: StreamChargeDonation = {
      id: createId(),
      createdAt: Date.now(),
      amount,
      userName: event.username,
      message: event.message,
    }

    this.donations.push(donation)
  }
}

const TWITCH_CHANNEL_REWARDS = [
  {
    code: 'positive1',
    rewardId: '57b753fb-3a74-47f3-bb88-5d4feab6f42e',
    rewardTitle: 'Солнечная панель',
    description: 'Преобразует фоновое излучение в энергию, +2 каждый тик. Действует 3 минуты.',
    price: 100,
    actionTimeInSeconds: 180,
  },
  {
    code: 'positive2',
    rewardId: '66e1569d-2226-49f6-9abd-f8b0b03fd5fd',
    rewardTitle: 'Квантовый аккумулятор',
    description: 'Накапливает энергию из окружающего пространства, восстанавливая +5 каждый тик в течение 2 минут.',
    price: 200,
    actionTimeInSeconds: 120,
  },
  {
    code: 'positive3',
    rewardId: 'd37c5835-db07-44b2-80cb-e16f854ae8b7',
    rewardTitle: 'Магнитный ускоритель',
    description: 'Усиливает поток энергии, увеличивая скорость восстановления в 2 раза. Действует 8 минут.',
    price: 400,
    actionTimeInSeconds: 480,
  },
  {
    code: 'positive4',
    rewardId: '121c393a-d5a2-4167-aa4b-efe4a016ea6d',
    rewardTitle: 'Энергетический всплеск',
    description: 'Мощный выброс энергии, мгновенно восстанавливающий 5% уровня Заряженности.',
    price: 800,
    actionTimeInSeconds: 0,
  },
  {
    code: 'negative1',
    rewardId: 'e5420bca-e719-4b8d-8a15-d8ae46739d74',
    rewardTitle: 'Энергетическая утечка',
    description: 'Создает дыру в энергетическом поле, -2 каждый тик. Действует 3 минуты.',
    price: 150,
    actionTimeInSeconds: 180,
  },
  {
    code: 'negative2',
    rewardId: 'aa0ca8b8-cf9e-4161-8a75-b3c67dd97cb0',
    rewardTitle: 'Разряд конденсатора',
    description: 'Упс, такие дела. -5 каждый тик в течение 2 минут.',
    price: 250,
    actionTimeInSeconds: 120,
  },
  {
    code: 'negative3',
    rewardId: '0e6ebe0c-8d6a-4f0d-a300-1269c0d44339',
    rewardTitle: 'Энергетический шторм',
    description: 'Создает хаос в энергетическом поле, снижающий скорость восстановления в 2 раза. Действует 8 минут.',
    price: 500,
    actionTimeInSeconds: 480,
  },
  {
    code: 'negative4',
    rewardId: '48c5e058-2b71-4ae3-9f6f-b0342a9f2032',
    rewardTitle: 'Электромагнитный разряд',
    description: 'Мощный разряд, мгновенно уменьшающий уровень Заряженности на 5%.',
    price: 1000,
    actionTimeInSeconds: 0,
  },
  {
    code: 'neutral1',
    rewardId: '178832f9-f84e-4376-a205-db57ac4f0406',
    rewardTitle: 'Нулевой резонанс',
    description: 'Создание состояния, при котором все эффекты взаимно уничтожаются.',
    price: 2500,
    actionTimeInSeconds: 0,
  },
]
