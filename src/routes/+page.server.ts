import type { PageServerLoad } from "./$types"

export const prerender = false
export const ssr = false

export const load: PageServerLoad = async (params) => {
  return {
    title: "Привет",
  }
}
