import { api } from '$lib/server/api'

export async function load() {
  const profileInfo = await api.profile.getInfo()
  if (profileInfo instanceof Error) {
    return {
      count: 0,
    }
  }

  return {
    count: profileInfo.count,
  }
}
