import type { EventHandlerRequest } from 'h3'
import type { StreamerUpdateResponse } from '@chat-game/types'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<StreamerUpdateResponse>>(
  async (event) => {
    const profileId = getRouterParam(event, 'id')

    await db.profile.update({
      where: { id: profileId },
      data: {
        isStreamer: true,
      },
    })

    return {
      ok: true,
    }
  }
)
