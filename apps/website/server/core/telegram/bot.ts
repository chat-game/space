import { Bot } from 'grammy'
import { dictionary } from '../locale'
import { activateProduct } from '../product/activate'
import { notifyAdmin } from './oldBot'

const logger = useLogger('telegram')
const { telegramGameBotToken } = useRuntimeConfig()

const startAppData = 'new'
const gameUrl = `tg://resolve?domain=woodlandsgamebot&appname=game&startapp=${startAppData}`
const gameChannelUrl = 'https://t.me/chatgamespace'
const chatgameUrl = 'https://chatgame.space'

let gameBot: Bot | null = null

function useCreateGameBot() {
  gameBot = new Bot(telegramGameBotToken)

  gameBot.on('message:text', async (ctx) => {
    try {
      const locale = ctx.message.from.language_code

      if (ctx.hasCommand('start')) {
        // Tree sticker
        // await ctx.replyWithSticker('CAACAgEAAxkBAAENexdng5nCguO04hJRGAABxUYQUdZlkmMAAj8CAALjmxhEgCIYC2AbEOM2BA')

        // Welcome message with buttons
        await ctx.reply(
          dictionary(locale).bots.woodland.welcomeMessage,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: dictionary(locale).bots.woodland.play, url: gameUrl }],
                [{ text: dictionary(locale).bots.subscribeToChannel, url: gameChannelUrl }],
                [{ text: dictionary(locale).bots.woodland.website, url: chatgameUrl }],
              ],
            },
          },
        )

        return
      }

      logger.log(ctx.message.from.id, ctx.message.text)
      ctx.reply(dictionary(locale).bots.defaultBotReply)
    } catch (error) {
      logger.error(error)
    }
  })

  // regexp: id in object like { payment_id: 123 }
  gameBot.preCheckoutQuery(/.+/, async (ctx) => {
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
  gameBot.on('message:successful_payment', async (ctx) => {
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

          await activateProduct({ productId: payment.productId, profileId: payment.profileId })

          await notifyAdmin(`[Woodlands] Профиль ${payment.profileId} совершил покупку. +${payment.amount} XTR`)
        }
      }

      logger.log('message:successful_payment', ctx?.message?.successful_payment)
    } catch (error) {
      logger.error(error)
    }
  })

  gameBot.start()
}

function useGameBot(): Bot {
  if (!gameBot) {
    throw new Error('Bot is not created')
  }

  return gameBot
}

export { useCreateGameBot, useGameBot }
