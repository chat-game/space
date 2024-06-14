import type { LayoutServerLoad } from './$types'

export const load = (async ({ locals }) => {
  return {
    profile: locals.profile,
  }
}) satisfies LayoutServerLoad
