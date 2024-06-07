import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const data = await request.json()
  if (!data?.hash) {
    return json({
      ok: false
    })
  }

  const items = new URLSearchParams(data.hash);

  if (items.has("access_token")) {
    const accessToken = items.get("access_token")
    if (accessToken) {
      cookies.set("chat-game-twitch-access-token", accessToken, { path: "/" })
    }
  }

  return json({
    ok: true
  })
};
