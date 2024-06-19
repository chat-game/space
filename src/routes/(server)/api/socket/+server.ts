import { type RequestHandler, json } from '@sveltejs/kit'
import { wss } from '$lib/server/socket/websocket.server'
import type { WebSocketMessage } from '$lib/game/types'

function sendMessage(
  event: WebSocketMessage['event'],
  object?: WebSocketMessage['object'],
) {
  console.log(wss.address())
  console.log(event, object)
  // server.publish('game', JSON.stringify({ id: createId(), event, object }))
}

export const GET: RequestHandler = () => {
  sendMessage('MAIN_QUEST_STARTED')

  return json({
    ok: true,
  })
}
