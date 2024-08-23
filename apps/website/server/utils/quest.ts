import { createId } from '@paralleldrive/cuid2'
import type { QuestReward } from '@chat-game/types'
import { DBRepository } from './repository'

export class QuestService {
  readonly #repository: DBRepository

  constructor() {
    this.#repository = new DBRepository()
  }

  async updateProgress(profileId: string) {
    const profileQuests = await this.#repository.findProfileQuests(profileId)

    for (const quest of profileQuests) {
      let progress = quest.editions[0]
      if (!progress) {
        progress = await this.#repository.createQuestEdition({
          id: createId(),
          completedAt: null,
          status: 'IN_PROGRESS',
          questId: quest.id,
          progress: 0,
          profileId,
        })
      }
    }
  }

  async completeQuest(id: string, profileId: string) {
    const profileQuests = await this.#repository.findProfileQuests(profileId)
    const quest = profileQuests.find((q) => q.id === id)
    const questEdition = quest?.editions[0]
    const questRewards = quest?.rewards as QuestReward[]

    if (!questEdition || questEdition.status === 'COMPLETED') {
      return
    }

    if (id === 'xu44eon7teobb4a74cd4yvuh') {
      // Coupon taken
      await this.#repository.updateQuestEdition(questEdition.id, {
        completedAt: new Date(),
        status: 'COMPLETED',
      })

      await this.#repository.addRangerPoints(profileId, quest.points)

      // Rewards
      for (const reward of questRewards) {
        if (reward.type === 'COINS') {
          await this.#repository.addCoinsToProfileFromQuest(profileId, quest.id, reward.amount)
        }
        if (reward.type === 'TROPHY' && reward.entityId) {
          await this.#repository.addTrophyToProfile(reward.entityId, profileId)
        }
      }
    }
  }
}
