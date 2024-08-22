import type { EventHandlerRequest } from 'h3'
import type { CharacterWithProfile } from '@chat-game/types'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<CharacterWithProfile>>(
  async (event) => {
    const id = getRouterParam(event, 'id')

    const character = await db.character.findFirst({
      where: { id },
      include: {
        profile: true,
        editions: true,
      },
    })
    if (!character) {
      throw createError({
        status: 404,
      })
    }

    return character as CharacterWithProfile
  }
)
