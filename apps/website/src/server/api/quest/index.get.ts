import type { EventHandlerRequest } from 'h3'
import type { QuestWithRewards } from '@chat-game/types'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<QuestWithRewards[]>>(async () => {
  const quests = await db.quest.findMany({
    include: {
      rewards: true,
    },
  })

  return quests as QuestWithRewards[]
})
