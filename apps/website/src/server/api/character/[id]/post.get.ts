import type { EventHandlerRequest } from 'h3'
import type { Post } from '@chat-game/types'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<Post[]>>(async (event) => {
  const characterId = getRouterParam(event, 'id')

  const posts = await db.post.findMany({
    where: { characterId },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      profile: true,
      likes: true,
    },
  })
  if (!posts) {
    throw createError({
      status: 404,
    })
  }

  return posts as Post[]
})
