import type { EventHandlerRequest } from 'h3'
import type { CharacterWithEditions } from '@chat-game/types'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<CharacterWithEditions[]>>(
  async () => {
    const characters = await db.character.findMany({
      orderBy: {
        price: 'asc',
      },
      include: {
        editions: true,
      },
    })

    if (!characters.length) {
      return []
    }

    return characters as CharacterWithEditions[]
  }
)
