import type { StreamerUpdateResponse } from '@chat-game/types'
import type { EventHandlerRequest } from 'h3'

export default defineEventHandler<EventHandlerRequest, Promise<StreamerUpdateResponse>>(
  async (event) => {
    const profileId = getRouterParam(event, 'id')

    await prisma.profile.update({
      where: { id: profileId },
      data: {
        isStreamer: true,
      },
    })

    return {
      ok: true,
    }
  },
)
