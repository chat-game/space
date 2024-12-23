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

// regexp: id in object like { payment_id: 123 }
bot.preCheckoutQuery(/.+/, async (ctx) => {
  try {
    const invoicePayload = JSON.parse(ctx.preCheckoutQuery.invoice_payload)

    // Telegram payment in stars
    if (invoicePayload?.payment_id) {
      await ctx.answerPreCheckoutQuery(true)
    }

    logger.log('preCheckoutQuery', ctx?.preCheckoutQuery)
  } catch (error) {
    logger.error(error)
  }
})

// successful_payment
bot.on('message:successful_payment', async (ctx) => {
  try {
    if (ctx?.message?.successful_payment?.invoice_payload && ctx?.message?.successful_payment?.telegram_payment_charge_id) {
    // invoice_payload
      const invoicePayload = JSON.parse(ctx.message.successful_payment.invoice_payload)

      // Telegram payment in stars
      if (invoicePayload?.payment_id) {
      // telegram_payment_charge_id
        const id = invoicePayload?.payment_id as string
        const telegramChargeId = ctx.message.successful_payment.telegram_payment_charge_id

        await prisma.payment.update({
          where: { id },
          data: {
            telegramChargeId,
          },
        })
      }
    }

    logger.log('message:successful_payment', ctx?.message?.successful_payment)
  } catch (error) {
    logger.error(error)
  }
})

export { bot }
