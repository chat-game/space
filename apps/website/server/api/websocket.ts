import { createId } from '@paralleldrive/cuid2'
import type { WebSocketEvents } from '@chat-game/types'
import { Room } from '../utils/room'

const logger = useLogger('ws')
export const activeRooms: Room[] = []

export function sendMessage(message: WebSocketEvents, token: string): void {
  const rooms = activeRooms.filter((room) => room.token === token)

  for (const room of rooms) {
    const preparedMessage = JSON.stringify({ id: createId(), ...message })
    room.peer.send(preparedMessage)
  }
}

export default defineWebSocketHandler({
  open(peer) {
    logger.verbose('open', peer.id, JSON.stringify(peer.headers))

    if (!peer?.headers || !('sec-websocket-protocol' in peer.headers)) {
      return
    }

    const [id, token] = peer.headers['sec-websocket-protocol'].split(', ')
    if (!id || !token) {
      return
    }

    activeRooms.push(new Room({ id, token, peer }))
  },

  message(peer, message) {
    logger.verbose('message', peer.id, JSON.stringify(peer.headers), message.text())

    if (message.text().includes('ping')) {
      peer.send('pong')
    }
  },

  close(peer, event) {
    logger.verbose('close', peer.id, JSON.stringify(event))

    const findIndex = activeRooms.findIndex((room) => room.peer.id === peer.id)
    activeRooms.splice(findIndex, 1)
  },

  error(peer, error) {
    logger.error('error', peer.id, JSON.stringify(error))
  },
})
