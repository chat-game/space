import { en, ru } from '@chat-game/locale'
import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
  legacy: false,
  pluralRules: {
    ru: pluralizationRu,
  },
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, ru },
})

export function setLocale(languageCode: string | undefined) {
  if (!languageCode) {
    i18n.global.locale.value = 'en'
    return
  }

  if (languageCode === 'ru') {
    i18n.global.locale.value = languageCode
    return
  }

  i18n.global.locale.value = 'en'
}

function pluralizationRu(choice: number, choicesLength: number) {
  if (choice === 0) {
    return 0
  }

  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1
  if (!teen && endsWithOne) {
    return 1
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2
  }

  return choicesLength < 4 ? 2 : 3
}
