import type { InitData } from '@telegram-apps/init-data-node'
import type { H3Event } from 'h3'
import { parse, validate } from '@telegram-apps/init-data-node'

const { telegramBotToken } = useRuntimeConfig()

const logger = useLogger('validateTelegramData')

export function validateTelegramData(event: H3Event): InitData | undefined {
  const headers = getHeaders(event)
  const token = headers.authorization ?? headers.Authorization
  if (!token) {
    return
  }

  const [_, authData] = token.split(' ')
  if (!authData) {
    return
  }

  try {
    validate(authData, telegramBotToken, { expiresIn: 3600 })
    return parse(authData)
  } catch (e) {
    logger.error(e)
  }
}
