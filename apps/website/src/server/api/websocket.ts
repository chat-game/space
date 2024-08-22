import { createId } from '@paralleldrive/cuid2'
import type { WebSocketEvents } from '@chat-game/types'
import { Room } from '../utils/room'
import type { Peer } from 'crossws'

export const activeRooms: Room[] = []

export function sendMessage(message: WebSocketEvents, token: string): void {
  const rooms = activeRooms.filter((room) => room.token === token)

  for (const room of rooms) {
    const preparedMessage = JSON.stringify({ id: createId(), ...message })
    room.peer.send(preparedMessage)
  }
}

export default defineWebSocketHandler({
  open(peer: Peer<unknown>) {
    log('[ws] open', peer.id, JSON.stringify(peer.headers))

    if (!peer?.headers || !('sec-websocket-protocol' in peer.headers)) {
      return
    }

    const [id, token] = peer.headers['sec-websocket-protocol'].split(', ')
    if (!id || !token) {
      return
    }

    activeRooms.push(new Room({ id, token, peer }))
  },

  message(peer: Peer<unknown>, message) {
    log('[ws] message', peer.id, JSON.stringify(peer.headers), message.text())

    if (message.text().includes('ping')) {
      peer.send('pong')
    }
  },

  close(peer: Peer<unknown>, event) {
    log('[ws] close', peer.id, JSON.stringify(event))

    const findIndex = activeRooms.findIndex((room) => room.peer.id === peer.id)
    activeRooms.splice(findIndex, 1)
  },

  error(peer: Peer<unknown>, error) {
    log('[ws] error', peer.id, JSON.stringify(error))
  },
})
