import type { EventHandlerRequest } from 'h3'
import type { CharacterWithProfile } from '@chat-game/types'

export default defineEventHandler<EventHandlerRequest, Promise<CharacterWithProfile>>(
  async (event) => {
    const id = getRouterParam(event, 'id')

    const character = await prisma.character.findFirst({
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
  },
)
