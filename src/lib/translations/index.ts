import { ru } from '$lib/translations/ru'
import { type Dictionary, en } from '$lib/translations/en'

export type Locale = 'en' | 'ru'

export const defaultLocale = 'en'

export const supportedLocales = ['en', 'ru'] as Locale[]

const translations = {
  en,
  ru,
}

export function dictionary(locale: Locale): Dictionary {
  return translations[locale]
}
