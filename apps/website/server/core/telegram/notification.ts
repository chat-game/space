import { gameBot } from './bot'

export async function sendNotificationToAllPlayers() {
  const telegramProfiles = await prisma.telegramProfile.findMany()

  for (const telegramProfile of telegramProfiles) {
    try {
      await gameBot.api.sendMessage(telegramProfile.telegramId, `Появилась возможность активировать предметы в Инвентаре! 🎉

Кладу тебе в Инвентарь Банан 🍌 Можешь его съесть и получить награду.`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🎮 Открыть игру', url: `tg://resolve?domain=woodlandsgamebot&appname=game&startapp=banana` }],
          ],
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  return true
}
