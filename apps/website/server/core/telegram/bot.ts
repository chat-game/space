import { Bot } from 'grammy'
import { activateProduct } from '../product/activate'

const logger = useLogger('telegram')
const { telegramBotToken, telegramGameBotToken, telegramAdminId } = useRuntimeConfig()

const startAppData = 'new'
const gameUrl = `tg://resolve?domain=woodlandsgamebot&appname=game&startapp=${startAppData}`
const gameChannelUrl = 'https://t.me/chatgamespace'

const woodlandsBotUrl = 'https://t.me/WoodlandsGameBot'
const twitchUrl = 'https://twitch.tv/hmbanan666'
const chatgameUrl = 'https://chatgame.space'

const ru: typeof en = {
  chatgame: {
    welcomeMessage: `Добро пожаловать в ChatGame! 🥳

Выбери игру или действие 👇`,
    playingOnTwitch: '👾 Играем на Twitch',
  },
  woodland: {
    welcomeMessage: `Добро пожаловать в Woodlands! 🥳

Одна из задач - сопровождать Машину из точки А в точку Б. По пути могут встречаться препятствия. Тапай их! 👆💪

Участвуй в событиях, приглашай друзей, добывай Монеты и разблокируй вручную созданных персонажей. 🤴🎅🐶`,
    title: '🌲 Woodlands: Онлайн-игра',
    play: '🎮 Играть',
    developingGameOnTwitch: '👾 Улучшаем игру на Twitch',
    website: 'Веб-сайт проекта',
  },
  subscribeToChannel: '📢 Подпишись на канал',
  defaultBotReply: 'Я пока не умею отвечать на сообщения. Свяжись с @hmbanan666, если есть вопросы.',
}

const en = {
  chatgame: {
    welcomeMessage: `Welcome to ChatGame! 🥳

Choose the game or action 👇`,
    playingOnTwitch: '👾 Playing on Twitch',
  },
  woodland: {
    welcomeMessage: `Welcome to Woodlands! 🥳

One of the tasks is to accompany the Machine from point A to point B. Along the way, obstacles may appear. Tap them! 👆💪

Participate in events, invite friends, collect Coins and unlock manually created characters. 🤴🎅🐶`,
    title: '🌲 Woodlands: Online Game',
    play: '🎮 Play',
    developingGameOnTwitch: '👾 Developing game on Twitch',
    website: 'Website of project',
  },
  subscribeToChannel: '📢 Subscribe to the channel',
  defaultBotReply: 'I dont know how to reply to messages yet. Contact @hmbanan666 if you have any questions.',
}

function dictionary(locale: string | undefined = 'en') {
  switch (locale) {
    case 'ru':
      return ru
    default:
      return en
  }
}

const bot = new Bot(telegramBotToken)
const gameBot = new Bot(telegramGameBotToken)

// Old bot
bot.on('message:text', async (ctx) => {
  const locale = ctx.message.from.language_code

  if (ctx.hasCommand('start')) {
    // Welcome message with buttons
    await ctx.reply(
      dictionary(locale).chatgame.welcomeMessage,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: dictionary(locale).woodland.title, url: woodlandsBotUrl }],
            [{ text: dictionary(locale).subscribeToChannel, url: gameChannelUrl }],
            [{ text: dictionary(locale).chatgame.playingOnTwitch, url: twitchUrl }],
          ],
        },
      },
    )

    return
  }

  logger.log(ctx.message.from.id, ctx.message.text)
  ctx.reply(dictionary(locale).defaultBotReply)
})

// Game bot
gameBot.on('message:text', async (ctx) => {
  const locale = ctx.message.from.language_code

  if (ctx.hasCommand('start')) {
    // Tree sticker
    await ctx.replyWithSticker('CAACAgEAAxkBAAENexdng5nCguO04hJRGAABxUYQUdZlkmMAAj8CAALjmxhEgCIYC2AbEOM2BA')

    // Welcome message with buttons
    await ctx.reply(
      dictionary(locale).woodland.welcomeMessage,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: dictionary(locale).woodland.play, url: gameUrl }],
            [{ text: dictionary(locale).subscribeToChannel, url: gameChannelUrl }],
            [{ text: dictionary(locale).woodland.website, url: chatgameUrl }],
          ],
        },
      },
    )

    await notifyAdmin(`[Woodlands] Команда старт от пользователя ${ctx.message.from.id} ${ctx.message.from.first_name}, locale: ${ctx.message.from.language_code}`)

    return
  }

  logger.log(ctx.message.from.id, ctx.message.text)
  ctx.reply(dictionary(locale).defaultBotReply)
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

async function notifyAdmin(message: string) {
  return bot.api.sendMessage(telegramAdminId, message)
}

export { bot, gameBot, notifyAdmin }
