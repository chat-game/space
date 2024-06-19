import { WebSocketServer } from 'ws'
import { createId } from '@paralleldrive/cuid2'
import type { WebSocketMessage } from '$lib/game/types'

export const wss = new WebSocketServer({ port: 4002 })

wss.on('connection', (ws) => {
  console.log(`WebSocket server: listening on ${ws.url}:${ws.protocol}`)

  ws.on('error', console.error)

  ws.on('message', (data) => {
    console.log('received: %s', data)
  })

  ws.send(JSON.stringify({ id: createId(), event: 'RAID_STARTED' }))
})

export function sendMessage(
  send: WebSocket['send'],
  event: WebSocketMessage['event'],
  object?: WebSocketMessage['object'],
) {
  send(JSON.stringify({ id: createId(), event, object }))
}
