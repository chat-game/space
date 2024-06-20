import { addTranslations, setLocale, setRoute } from '$lib/translations'

export async function load({ data }) {
  const { i18n, translations } = data
  const { locale, route } = i18n

  addTranslations(translations)

  await setRoute(route)
  await setLocale(locale)

  return i18n
}
