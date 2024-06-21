import type { LayoutServerLoad } from './$types'
import { dictionary } from '$lib/translations'

export const load = (async ({ locals }) => {
  const locale = locals.locale

  return {
    profile: locals.profile,
    locale,
    t: dictionary(locale),
  }
}) satisfies LayoutServerLoad
