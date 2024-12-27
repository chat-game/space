import type { InitData } from '@telegram-apps/init-data-node'

export default defineEventHandler(async (event) => {
  try {
    const telegram = event.context.telegram as InitData
    if (!telegram?.user) {
      throw createError({
        statusCode: 400,
        message: 'You must provide user',
      })
    }

    const telegramId = telegram.user.id.toString()

    const repository = new DBRepository()
    const profile = await repository.findOrCreateTelegramProfile({
      telegramId,
      username: telegram.user?.username,
      firstName: telegram.user?.firstName,
      lastName: telegram.user?.lastName,
    })

    return profile
  } catch (error) {
    throw errorResolver(error)
  }
})
