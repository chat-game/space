export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'profileId')

    const profile = await prisma.telegramProfile.findFirst({
      where: { id },
    })
    if (!profile) {
      throw createError({
        status: 404,
      })
    }

    return profile
  } catch (error) {
    throw errorResolver(error)
  }
})
