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

bot.preCheckoutQuery('invoice_payload', async (ctx) => {
  // Answer the pre-checkout query, confer https://core.telegram.org/bots/api#answerprecheckoutquery
  await ctx.answerPreCheckoutQuery(true)

  logger.log('preCheckoutQuery', ctx, ctx?.message, ctx?.msg, ctx?.chat, ctx?.preCheckoutQuery)
})

// regexp: id in object like { payment_id: 123 }
bot.preCheckoutQuery(/.+/, async (ctx) => {
  const invoicePayload = ctx.preCheckoutQuery.invoice_payload
  logger.log(invoicePayload)

  await ctx.answerPreCheckoutQuery(true)

  logger.log('preCheckoutQuery regexp', ctx, ctx?.message, ctx?.msg, ctx?.chat, ctx?.preCheckoutQuery)
})

// successful_payment -> Store the SuccessfulPayment’s telegram_payment_charge_id
bot.on('pre_checkout_query', async (ctx) => {
  logger.log('pre_checkout_query', ctx, ctx?.message, ctx?.msg, ctx?.chat, ctx?.preCheckoutQuery)
})
bot.on('message:successful_payment', async (ctx) => {
  logger.log('message:successful_payment', ctx, ctx?.message, ctx?.msg, ctx?.chat, ctx?.message?.successful_payment)
})

export { bot }
