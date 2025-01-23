import { validateTelegramData } from '~~/server/core/telegram/validate'

export default defineEventHandler(async (event) => {
  try {
    const telegram = validateTelegramData(event)
    if (!telegram?.user) {
      throw createError({
        statusCode: 400,
        message: 'User is not valid',
      })
    }

    const telegramId = telegram.user.id.toString()

    const repository = new DBRepository()
    const profile = await repository.findOrCreateTelegramProfile({
      telegramId,
      username: telegram.user?.username,
      firstName: telegram.user?.firstName,
      lastName: telegram.user?.lastName,
      languageCode: telegram.user?.languageCode,
    })

    return profile
  } catch (error) {
    throw errorResolver(error)
  }
})
