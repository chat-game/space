import { Bot } from 'grammy'

const logger = useLogger('telegram')
const { telegramBotToken } = useRuntimeConfig()

// Create a bot object
const bot = new Bot(telegramBotToken)

// Register listeners to handle messages
bot.on('message:text', (ctx) => {
  logger.log(ctx.message.from.id, ctx.message.text)
  ctx.reply('Привет! Я пока не умею отвечать на сообщения.')
})

export { bot }
