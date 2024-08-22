import type { EventHandlerRequest } from 'h3'
import type { TwitchToken } from '@chat-game/types'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<TwitchToken[]>>(async (event) => {
  const profileId = getRouterParam(event, 'id')

  const tokens = (await db.twitchToken.findMany({
    where: { profileId },
  })) as TwitchToken[]
  if (!tokens) {
    throw createError({
      status: 404,
    })
  }

  return tokens
})
