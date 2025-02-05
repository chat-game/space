import { Bot } from 'grammy'
import { dictionary } from '../locale'

const logger = useLogger('telegram')
const { telegramBotToken, telegramAdminId } = useRuntimeConfig()

const gameChannelUrl = 'https://t.me/chatgamespace'
const woodlandsBotUrl = 'https://t.me/WoodlandsGameBot'
const twitchUrl = 'https://twitch.tv/hmbanan666'

let bot: Bot | null = null

function useCreateBot() {
  bot = new Bot(telegramBotToken)

  bot.on('message:text', async (ctx) => {
    const locale = ctx.message.from.language_code

    if (ctx.hasCommand('start')) {
      // Welcome message with buttons
      await ctx.reply(
        dictionary(locale).bots.chatgame.welcomeMessage,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: dictionary(locale).bots.woodland.title, url: woodlandsBotUrl }],
              [{ text: dictionary(locale).bots.subscribeToChannel, url: gameChannelUrl }],
              [{ text: dictionary(locale).bots.chatgame.playingOnTwitch, url: twitchUrl }],
            ],
          },
        },
      )

      return
    }

    logger.log(ctx.message.from.id, ctx.message.text)
    ctx.reply(dictionary(locale).bots.defaultBotReply)
  })

  bot.start()
}

function useBot(): Bot {
  if (!bot) {
    throw new Error('Bot is not created')
  }

  return bot
}

async function notifyAdmin(message: string) {
  return useBot().api.sendMessage(telegramAdminId, message)
}

export { notifyAdmin, useBot, useCreateBot }
