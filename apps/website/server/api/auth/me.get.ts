export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
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

  return {
    user: session.user,
    profile,
  }
})
