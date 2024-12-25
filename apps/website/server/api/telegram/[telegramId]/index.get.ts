export default defineEventHandler(async (event) => {
  try {
    const telegramId = getRouterParam(event, 'telegramId')
    if (!telegramId) {
      throw createError({
        statusCode: 400,
        message: 'You must provide telegramId',
      })
    }

    const query = getQuery(event)
    const username = query?.username?.toString()
    const firstName = query?.firstName?.toString()
    const lastName = query?.lastName?.toString()

    const repository = new DBRepository()
    const profile = await repository.findOrCreateTelegramProfile({
      telegramId,
      username,
      firstName,
      lastName,
    })

    return profile
  } catch (error) {
    throw errorResolver(error)
  }
})
