import process from 'node:process'
import { useCreateGameBot } from '../core/telegram/bot'
import { useCreateBot } from '../core/telegram/oldBot'

export default defineNitroPlugin(() => {
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  const logger = useLogger('plugin-start-telegram')
  const { telegramBotToken, telegramGameBotToken } = useRuntimeConfig()

  if (!telegramBotToken || !telegramGameBotToken) {
    // No config provided
    return
  }

  // Start the bots (using long polling)
  useCreateBot()
  useCreateGameBot()

  logger.success('Telegram server started')
})
