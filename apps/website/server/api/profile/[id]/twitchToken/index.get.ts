import type { EventHandlerRequest } from 'h3'
import type { TwitchToken } from '@chat-game/types'

export default defineEventHandler<EventHandlerRequest, Promise<TwitchToken[]>>(async (event) => {
  const profileId = getRouterParam(event, 'id')

  const tokens = (await prisma.twitchToken.findMany({
    where: { profileId },
  })) as TwitchToken[]
  if (!tokens) {
    throw createError({
      status: 404,
    })
  }

  return tokens
})
