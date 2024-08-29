import { createId } from '@paralleldrive/cuid2'

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'id')
  const session = await getUserSession(event)

  if (!session?.user) {
    throw createError({
      statusCode: 400,
      message: 'Invalid data',
    })
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  })
  if (!post) {
    throw createError({
      status: 404,
    })
  }

  const profile = await prisma.profile.findUnique({
    where: { id: session.user.id },
  })
  if (!profile) {
    throw createError({
      status: 404,
    })
  }

  // Check if already have like
  const like = await prisma.like.findFirst({
    where: { profileId: profile.id, postId: post.id },
  })
  if (like?.id) {
    throw createError({
      status: 400,
      message: 'Already liked',
    })
  }

  await prisma.like.create({
    data: {
      id: createId(),
      profileId: profile.id,
      postId: post.id,
    },
  })

  await prisma.post.update({
    where: { id: post.id },
    data: {
      rating: { increment: 1 },
    },
  })

  // +1 point storyteller to post author
  await prisma.profile.update({
    where: { id: post.profileId },
    data: {
      storytellerPoints: { increment: 1 },
    },
  })

  return {
    ok: true,
  }
})
