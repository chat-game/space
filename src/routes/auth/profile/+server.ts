import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
  const user = cookies.get("chat-game-twitch-access-token")
  if (!user) {
    return error(401)
  }

  return json({
    profile: {
      userName: "123"
    }
  })
};
