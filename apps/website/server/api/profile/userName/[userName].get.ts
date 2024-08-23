import type { EventHandlerRequest } from 'h3'
import type { ProfileWithOwnedCharacters } from '@chat-game/types'

export default defineEventHandler<EventHandlerRequest, Promise<ProfileWithOwnedCharacters>>(
  async (event) => {
    const userName = getRouterParam(event, 'userName')

    const profile = await prisma.profile.findFirst({
      where: { userName },
      include: {
        characterEditions: {
          include: {
            character: true,
          },
        },
      },
    })
    if (!profile) {
      throw createError({
        status: 404,
      })
    }

    return profile as ProfileWithOwnedCharacters
  },
)
