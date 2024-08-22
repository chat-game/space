import type { EventHandlerRequest } from 'h3'
import type { CharacterEditionWithProfile } from '@chat-game/types'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<CharacterEditionWithProfile[]>>(
  async (event) => {
    const characterId = getRouterParam(event, 'id')

    const editions = await db.characterEdition.findMany({
      where: { characterId },
      orderBy: { xp: 'desc' },
      take: 10,
      include: {
        profile: true,
        character: true,
      },
    })
    if (!editions) {
      throw createError({
        status: 404,
      })
    }

    return editions as CharacterEditionWithProfile[]
  }
)
