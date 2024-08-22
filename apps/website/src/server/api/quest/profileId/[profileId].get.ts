import type { EventHandlerRequest } from 'h3'
import type { QuestWithEditions } from '@chat-game/types'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<QuestWithEditions[]>>(
  async (event) => {
    const profileId = getRouterParam(event, 'profileId')

    const quests = (await db.quest.findMany({
      include: {
        editions: {
          where: { profileId },
        },
        rewards: true,
        profile: true,
      },
    })) as QuestWithEditions[]
    if (!quests) {
      throw createError({
        status: 404,
      })
    }

    return quests
  }
)
