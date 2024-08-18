import { dictionary } from '$lib/translations'

export async function load({ locals }) {
  const locale = locals.locale

  return {
    profile: locals.profile,
    locale,
    t: dictionary(locale),
  }
}
