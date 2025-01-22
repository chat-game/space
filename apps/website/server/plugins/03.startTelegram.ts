import process from 'node:process'
import { gameBot } from '../core/telegram/bot'
import { bot } from '../core/telegram/oldBot'

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
  bot.start()
  gameBot.start()

  logger.success('Telegram server started')
})
