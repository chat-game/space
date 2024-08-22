import type { EventHandlerRequest } from 'h3'
import type { TwitchTokenWithProfile } from '@chat-game/types'
import { getDateMinusMinutes } from '../../../utils/date'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<TwitchTokenWithProfile[]>>(
  async () => {
    const gte = getDateMinusMinutes(5)

    return (await db.twitchToken.findMany({
      where: { onlineAt: { gte } },
      include: {
        profile: true,
      },
    })) as TwitchTokenWithProfile[]
  }
)
