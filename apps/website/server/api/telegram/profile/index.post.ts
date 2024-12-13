import { DBRepository } from '../../../utils/repository'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.telegramId) {
      throw createError({
        statusCode: 400,
        message: 'You must provide telegramId',
      })
    }

    const repository = new DBRepository()
    const profile = await repository.findOrCreateTelegramProfile({
      telegramId: body.telegramId,
      username: body.username,
    })

    return {
      ok: true,
      result: profile,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
