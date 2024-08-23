import type { EventHandlerRequest } from 'h3'
import type { TwitchTokenWithProfile } from '@chat-game/types'
import { getDateMinusMinutes } from '../../../utils/date'

export default defineEventHandler<EventHandlerRequest, Promise<TwitchTokenWithProfile[]>>(
  async () => {
    const gte = getDateMinusMinutes(5)

    return (await prisma.twitchToken.findMany({
      where: { onlineAt: { gte } },
      include: {
        profile: true,
      },
    })) as TwitchTokenWithProfile[]
  },
)
