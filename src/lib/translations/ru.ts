import type { Dictionary } from '$lib/translations/en'

export const ru = {
  about: undefined,
  profile: {
    link: 'Мой профиль',
    play: 'Играть',
    signOut: 'Выйти',
  },
  error: {
    404: 'Страница не найдена.',
    500: 'Произошла ошибка на сервере.',
    title: 'О, Боже...',
    default: 'Ну вот... Или это фича?',
  },
  header: {
    menu: {
      home: 'Главная',
      about: 'Об игре',
      characters: 'Персонажи',
      coupon: 'Купон',
    },
  },
  footer: {
    text: 'Создается с трепетом и ❤️',
    github: 'Код на GitHub',
    donate: 'Донат',
  },
} satisfies Dictionary
