import { QuestService } from '../quest'
import { DBRepository } from '../repository'

export const TWITCH_CHANNEL_REWARDS = {
  add150ViewerPointsId: 'd8237822-c943-434f-9d7e-87a9f549f4c4',
  villainStealFuelId: 'd5956de4-54ff-49e4-afbe-ee4e62718eee',
  addNewIdea: '289457e8-18c2-4b68-8564-fc61dd60b2a2',
}

export class TwitchService {
  readonly #logger = useLogger('twitch-service')
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

  public async handleChannelRewardRedemption({
    userId,
    userName,
    rewardId,
    message,
  }: {
    userId: string
    userName: string
    rewardId: string
    message: string
  }) {
    this.#logger.log('The viewer bought a reward using channel points', userId, userName, rewardId, message)

    // const player = await this.game.repository.findOrCreatePlayer(
    //   userId,
    //   userName,
    // )
    // if (rewardId === TWITCH_CHANNEL_REWARDS.add150ViewerPointsId) {
    //   await this.game.repository.addPlayerViewerPoints(player.id, 150)
    //   return
    // }
    // if (rewardId === TWITCH_CHANNEL_REWARDS.villainStealFuelId) {
    //   return this.game.handleActionFromChat({
    //     action: 'STEAL_FUEL',
    //     userId,
    //     userName,
    //   })
    // }
    // if (rewardId === TWITCH_CHANNEL_REWARDS.addNewIdea) {
    //   return this.game.handleActionFromChat({
    //     action: 'CREATE_IDEA',
    //     userId,
    //     userName,
    //     params: [message],
    //   })
    // }
  }
}
