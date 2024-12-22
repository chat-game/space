import { bot } from '../core/telegram/bot'

export default defineNitroPlugin(() => {
  const logger = useLogger('plugin-start-telegram')
  const { telegramBotToken } = useRuntimeConfig()

  if (!telegramBotToken) {
    // No config provided
    return
  }

  // Start the bot (using long polling)
  bot.start()

  logger.log('Telegram server started')
})
