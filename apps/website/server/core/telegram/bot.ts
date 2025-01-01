import { Bot } from 'grammy'
import { activateProduct } from '../product/activate'

const logger = useLogger('telegram')
const { telegramBotToken, telegramAdminId } = useRuntimeConfig()

const startAppData = 'new'
const gameUrl = `tg://resolve?domain=chatgamespacebot&appname=game&startapp=${startAppData}`
const gameChannelUrl = 'https://t.me/chatgamespace'

// Create a bot object
const bot = new Bot(telegramBotToken)

bot.on('message:text', async (ctx) => {
  if (ctx.hasCommand('start')) {
    // Banana with candy sticker
    await ctx.replyWithSticker('CAACAgIAAxkBAAENa2pndQPLCpTicLfzY7zONwQLTPBwhgACXgMAArrAlQVceSrBWv5H7DYE')

    // Welcome message with buttons
    await ctx.reply(
      `Добро пожаловать в ChatGame! 🥳

Одна из задач - сопровождать Машину из точки А в точку Б. По пути могут встречаться препятствия. Тапай их! 👆💪

Участвуй в событиях, приглашай друзей, добывай Монеты и разблокируй вручную созданных персонажей. 🤴🎅🐶
      `,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🎮 Играть', url: gameUrl }],
            [{ text: '📢 Подпишись на канал', url: gameChannelUrl }],
            [{ text: '👾 Улучшаем игру на стримах', url: 'https://twitch.tv/hmbanan666' }],
          ],
        },
      },
    )

    return
  }

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
  } catch (error) {
    logger.error(error)
  }
})

// successful_payment
bot.on('message:successful_payment', async (ctx) => {
  try {
    if (ctx?.message?.successful_payment?.invoice_payload && ctx?.message?.successful_payment?.telegram_payment_charge_id) {
      const invoicePayload = JSON.parse(ctx.message.successful_payment.invoice_payload)

      // Telegram payment in stars
      if (invoicePayload?.payment_id) {
        const id = invoicePayload?.payment_id as string
        const telegramChargeId = ctx.message.successful_payment.telegram_payment_charge_id

        const payment = await prisma.payment.findFirst({
          where: { id },
        })
        if (!payment) {
          return
        }

        await prisma.payment.update({
          where: { id },
          data: {
            status: 'PAID',
            telegramChargeId,
          },
        })

        await activateProduct(payment.productId, payment.profileId)

        await notifyAdmin(`Пользователь ${payment.profileId} совершил покупку. +${payment.amount} XTR`)
      }
    }

    logger.log('message:successful_payment', ctx?.message?.successful_payment)
  } catch (error) {
    logger.error(error)
  }
})

async function notifyAdmin(message: string) {
  return bot.api.sendMessage(telegramAdminId, message)
}

export { bot, notifyAdmin }
