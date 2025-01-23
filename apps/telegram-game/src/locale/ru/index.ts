import type { Dictionary } from '..'
import { characters } from './characters'
import { items } from './items'
import { leaderboards } from './leaderboards'
import { products } from './products'
import { rooms } from './rooms'
import { trophies } from './trophies'

export const ru: Dictionary = {
  route: {
    title: {
      game: 'Игра',
      inventory: 'Инвентарь',
      quest: 'Задания',
      shop: 'Магазин',
      top: 'Топ',
      character: 'Персонаж',
    },
  },
  inventory: {
    empty: 'Нет предметов в инвентаре',
    currentAmount: 'В наличии: {n} шт.',
    chatgame: {
      title: 'Есть профиль на ChatGame?',
      description: 'Привяжи свою основную учетную запись на сайте. Потребуется Twitch.',
      button: 'Привязать',
    },
  },
  character: {
    title: 'Персонаж',
    titleActive: 'Активный персонаж',
    xpLeft: 'Осталось {xp} до следующего уровня',
    maxLevel: 'Максимум',
    maxLevelLabel: 'достиг максимального уровня',
    active: 'Активный',
    activeLabel: 'Это твой активный персонаж',
    level: 'уровень',
    reward: {
      title: 'Получай награды за уровни!',
      received: 'Получена',
    },
    unlock: {
      for: 'Разблокировать за',
      notForCoins: 'Персонажа нельзя разблокировать за Монеты',
      pressToConfirm: 'Нажми еще раз для подтверждения',
    },
    collection: {
      coins: 'Базовая коллекция',
      rare: 'Особые персонажи',
    },
  },
  item: {
    woodlandPoint: {
      title: 'Вудланды',
      amount: 'Вудландов | Вудланд | Вудланда | Вудландов',
      description: 'Является основным показателем прогресса в игре. Это как уровень профиля, но в виде очков. Их нельзя тратить - только накапливать.',
    },
    coin: {
      title: 'Монета',
      amount: 'Монет | Монета | Монеты | Монет',
      description: 'Является основной валютой для разблокировки персонажей.',
    },
    coupon: {
      title: 'Купон со стрима',
      amount: 'Купонов | Купон | Купона | Купонов',
      description: 'На стриме twitch.tv/hmbanan666 периодически появляются сообщения с инструкцией, как его получить. Обменивай на награду.',
      empty: 'Нет купонов',
    },
    trophy: {
      title: 'Трофей',
      titleMine: 'Мои трофеи',
      empty: 'Нет полученных трофеев',
      obtained: 'Получен',
    },
    eatAndGetReward: 'Съесть 1 шт. и получить награду',
  },
  room: {
    titleActive: 'Активная комната',
  },
  top: {
    players: 'Топ игроков',
    myResult: 'Мой результат',
  },
  shop: {
    titleSpecial: 'Специальные предложения',
  },
  trade: {
    for: 'Обменять на',
  },
  purchase: {
    for: 'Приобрести за',
    limited: 'Лимитированный',
  },
  welcome: {
    title: 'Приветствуем в игре!',
    description: 'Тапай куда угодно, чтобы передвигаться. Тапай деревья, чтобы их срубить.',
    hint: 'Что дальше: прокачивай персонажа, получай награды за уровни. Открывай новых персонажей.',
  },
  availableUntil: 'Доступен до',
  close: 'Закрыть',
  connect: 'Подключиться',
  activate: 'Активировать',
  reward: 'Награда',
  leaderboards,
  characters,
  rooms,
  products,
  items,
  trophies,
}
