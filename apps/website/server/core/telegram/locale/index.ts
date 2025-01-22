import { en } from './en'
import { ru } from './ru'

export type Dictionary = typeof en

export function dictionary(locale: string | undefined = 'en'): Dictionary {
  switch (locale) {
    case 'ru':
      return ru
    default:
      return en
  }
}
