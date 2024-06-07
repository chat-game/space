import type { LayoutServerLoad } from "./$types"

export const load = (async ({ cookies }) => {
  const user = cookies.get("chat-game-twitch-access-token")
  if (!user) {
    return {
      profile: null
    }
  }

  return {
    profile: {
      userName: "123"
    }
  }
}) satisfies LayoutServerLoad