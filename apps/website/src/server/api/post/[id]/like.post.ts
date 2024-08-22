import type { EventHandlerRequest } from 'h3'
import { createId } from '@paralleldrive/cuid2'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<{ ok: boolean }>>(async (event) => {
  const postId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!body.profileId) {
    throw createError({
      statusCode: 400,
      message: 'You must provide profileId',
    })
  }

  const post = await db.post.findUnique({
    where: { id: postId },
  })
  if (!post) {
    throw createError({
      status: 404,
    })
  }

  const profile = await db.profile.findUnique({
    where: { id: body.profileId },
  })
  if (!profile) {
    throw createError({
      status: 404,
    })
  }

  // Check if already have like
  const like = await db.like.findFirst({
    where: { profileId: body.profileId, postId: post.id },
  })
  if (like?.id) {
    throw createError({
      status: 400,
      message: 'Already liked',
    })
  }

  await db.like.create({
    data: {
      id: createId(),
      profileId: profile.id,
      postId: post.id,
    },
  })

  await db.post.update({
    where: { id: post.id },
    data: {
      rating: { increment: 1 },
    },
  })

  // +1 point storyteller to post author
  await db.profile.update({
    where: { id: post.profileId },
    data: {
      storytellerPoints: { increment: 1 },
    },
  })

  return {
    ok: true,
  }
})
