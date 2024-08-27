export default defineEventHandler(async (event) => {
  const characterId = getRouterParam(event, 'id')

  const posts = await prisma.post.findMany({
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

  return posts
})
