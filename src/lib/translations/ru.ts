import type { Dictionary } from '$lib/translations/en'

export const ru = {
  about: undefined,
  character: undefined,
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
  home: undefined,
} satisfies Dictionary
