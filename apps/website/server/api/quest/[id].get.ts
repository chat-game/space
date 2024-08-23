import type { EventHandlerRequest } from 'h3'
import type { QuestWithEditions } from '@chat-game/types'

export default defineEventHandler<EventHandlerRequest, Promise<QuestWithEditions>>(
  async (event) => {
    const id = getRouterParam(event, 'id')

    const quest = (await prisma.quest.findFirst({
      where: { id },
      include: {
        editions: {
          where: { status: 'COMPLETED' },
          include: {
            profile: true,
          },
          orderBy: { completedAt: 'desc' },
          take: 50,
        },
        rewards: true,
        profile: true,
      },
    })) as QuestWithEditions
    if (!quest) {
      throw createError({
        status: 404,
      })
    }

    return quest
  },
)
