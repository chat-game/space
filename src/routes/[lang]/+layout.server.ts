import { redirect } from '@sveltejs/kit'
import { dictionary, supportedLocales } from '$lib/translations'

export async function load({ locals, params }) {
  const locale = locals.locale

  if (!supportedLocales.find((locale) => locale === params.lang)) {
    redirect(301, `/${locale}`)
  }

  return {
    locale,
    t: dictionary(locale),
  }
}
