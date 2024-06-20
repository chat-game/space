import I18n from 'sveltekit-i18n'
import type { Config } from 'sveltekit-i18n'
import lang from './lang.json'
import { dev } from '$app/environment'

export const defaultLocale = 'en'

export const config: Config = {
  // preprocess: 'preserveArrays',
  log: {
    level: dev ? 'warn' : 'error',
  },
  translations: {
    en: { lang },
    ru: { lang },
  },
  loaders: [
    {
      locale: 'en',
      key: 'header',
      loader: async () => (await import('./en/header.json')).default,
    },
    {
      locale: 'en',
      key: 'error',
      loader: async () => (await import('./en/error.json')).default,
    },
    {
      locale: 'en',
      key: 'home',
      routes: ['/'],
      loader: async () => (await import('./en/home.json')).default,
    },
    {
      locale: 'en',
      key: 'about',
      routes: ['/about'],
      loader: async () => (await import('./en/about.json')).default,
    },
    {
      locale: 'en',
      key: 'character',
      routes: ['/character'],
      loader: async () => (await import('./en/character.json')).default,
    },
    {
      locale: 'ru',
      key: 'header',
      loader: async () => (await import('./ru/header.json')).default,
    },
    {
      locale: 'ru',
      key: 'error',
      loader: async () => (await import('./ru/error.json')).default,
    },
    {
      locale: 'ru',
      key: 'home',
      routes: ['/'],
      loader: async () => (await import('./ru/home.json')).default,
    },
    {
      locale: 'ru',
      key: 'about',
      routes: ['/about'],
      loader: async () => (await import('./ru/about.json')).default,
    },
    {
      locale: 'ru',
      key: 'character',
      routes: ['/character'],
      loader: async () => (await import('./ru/character.json')).default,
    },
  ],
}

export const {
  t,
  locale,
  locales,
  loading,
  addTranslations,
  loadTranslations,
  translations,
  setRoute,
  setLocale,
} = new I18n(config)

loading.subscribe(($loading) => $loading && console.log('Loading translations...'))
