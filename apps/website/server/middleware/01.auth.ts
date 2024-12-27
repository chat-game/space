import { parse, validate } from '@telegram-apps/init-data-node'

export default defineEventHandler(async (event) => {
  const logger = useLogger('middleware-01-auth')

  const { websiteBearer, telegramBotToken } = useRuntimeConfig()

  const headers = getHeaders(event)
  const token = headers.authorization ?? headers.Authorization

  // Payment webhook dont need auth
  if (event.path.startsWith('/api/payment/webhook')) {
    return
  }

  // All Telegram API requests
  if (event.path.startsWith('/api/telegram')) {
    logger.log('/api/telegram', 'token', token)

    if (!token) {
      return createError({
        statusCode: 403,
      })
    }

    const [_, authData] = token.split(' ')
    if (!authData) {
      return createError({
        statusCode: 403,
      })
    }

    try {
      validate(authData, telegramBotToken, { expiresIn: 3600 })
      event.context.telegram = parse(authData)
    } catch (e) {
      logger.error(e)
      return createError({
        statusCode: 403,
      })
    }

    return
  }

  const session = await getUserSession(event)
  if (session?.user) {
    // Already authenticated
    return
  }

  // Making request with Bearer token
  if (event.method !== 'GET' && event.method !== 'OPTIONS') {
    if (!token || token !== `Bearer ${websiteBearer}`) {
      return createError({
        statusCode: 403,
      })
    }
  }
})
