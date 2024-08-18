import { redirect } from '@sveltejs/kit'
import { dictionary, supportedLocales } from '$lib/translations'
import { api } from '$lib/server/api'

export async function load({ locals, params }) {
  const locale = locals.locale

  if (!supportedLocales.find((locale) => locale === params.lang)) {
    redirect(301, `/${locale}`)
  }

  let profileData = null
  if (locals.profile?.userName) {
    const profile = await api.profile.getByUserName(locals.profile.userName)
    if (!profile || profile instanceof Error) {
      profileData = null
    } else {
      profileData = profile
    }
  }

  return {
    locale,
    t: dictionary(locale),
    profileData,
  }
}
