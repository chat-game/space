import { api } from '$lib/server/api'

export async function load() {
  let trophies = await api.trophy.getList()
  if (!trophies || trophies instanceof Error) {
    trophies = []
  }

  return {
    trophies,
  }
}
