import type { LayoutServerLoad } from './$types'
import { defaultLocale, loadTranslations, locales, translations } from '$lib/translations'

export const load = (async ({ url, cookies, request, locals }) => {
  const { pathname } = url

  let locale = (cookies.get('lang') || '').toLowerCase()

  if (!locale) {
    locale = `${`${request.headers.get('accept-language')}`.match(/[a-z]+(?=[\-_,;])/i)}`.toLowerCase()
  }

  const supportedLocales = locales.get().map((l) => l.toLowerCase())

  if (!supportedLocales.includes(locale)) {
    locale = defaultLocale
  }

  await loadTranslations(locale, pathname)

  return {
    profile: locals.profile,
    i18n: { locale, route: pathname },
    translations: translations.get(),
  }
}) satisfies LayoutServerLoad
