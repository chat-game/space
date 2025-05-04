import { QuestService } from '../quest'
import { DBRepository } from '../repository'

export class TwitchService {
  readonly #quest: QuestService
  readonly #repository: DBRepository

  constructor() {
    this.#quest = new QuestService()
    this.#repository = new DBRepository()
  }

  async handleMessage({
    userName,
    userId,
    text,
  }: {
    userName: string
    userId: string
    text: string
  }) {
    const strings = text.split(' ')
    const firstWord = strings[0] ?? ''
    const firstChar = firstWord.charAt(0)
    const possibleCommand = firstWord.substring(1)
    const otherStrings = strings.toSpliced(0, 1)
    const firstParam = otherStrings[0] ?? ''

    const profile = await this.#repository.findProfileByTwitchId(userId)
    if (!profile) {
      return
    }

    const player = await this.#repository.findOrCreatePlayer({ profileId: profile.id, userName })

    if (firstChar === '!' && possibleCommand) {
      if (possibleCommand === 'купон' || possibleCommand === 'coupon') {
        return this.handleCouponActivation(firstParam, player.profileId)
      }
      if (possibleCommand === 'инвентарь' || possibleCommand === 'inventory') {
        return this.handleInventoryCommand(player.profileId)
      }
    }
  }

  async handleInventoryCommand(profileId: string) {
    const profile = await this.#repository.findProfile(profileId)
    if (!profile) {
      return {
        ok: false,
        message: null,
      }
    }

    return {
      ok: true,
      message: `У тебя есть ${profile.coupons} купон(а/ов). Обменивай их на награды в игре.`,
    }
  }

  async handleCouponActivation(id: string, profileId: string) {
    const status = await this.#repository.activateCouponByCommand(id, profileId)
    if (status === 'OK') {
      // Quest
      await this.#quest.completeQuest('xu44eon7teobb4a74cd4yvuh', profileId)

      return {
        ok: true,
        message: 'А ты молодец! +1 купон 🎟️',
      }
    }
    if (status === 'TIME_LIMIT') {
      return {
        ok: false,
        message: 'Неа, один уже взят. Новый - на следующем стриме 🍌',
      }
    }
    if (status === 'TAKEN_ALREADY') {
      return {
        ok: false,
        message: 'Тебя опередили 🔥',
      }
    }
    if (status === 'NOT_FOUND') {
      return {
        ok: false,
        message: null,
      }
    }
  }
}
