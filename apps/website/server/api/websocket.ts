import type { WebSocketEvents } from '@chat-game/types'
import { createId } from '@paralleldrive/cuid2'
import { Room } from '../utils/room'

const logger = useLogger('ws')
export const activeRooms: Room[] = []

export function sendMessage(message: WebSocketEvents, token: string): void {
  const rooms = activeRooms.filter((room) => room.token === token)

  for (const room of rooms) {
    const preparedMessage = JSON.stringify({ id: createId(), ...message })
    room.server.send(preparedMessage)
  }
}

export default defineWebSocketHandler({
  open(peer) {
    logger.log('open', peer.id)
  },

  async message(peer, message) {
    logger.log('message', peer.id, message.text())

    if (message.text().includes('ping')) {
      peer.send('pong')
      return
    }

    const parsed = JSON.parse(message.text())
    if (parsed?.id && parsed?.type) {
      if (parsed.type === 'CONNECT') {
        const client = parsed.data.client
        const id = parsed.data.id

        if (client === 'ADDON') {
          const token = parsed.data.token
          // Create if not exist
          if (!activeRooms.find((room) => room.token === token)) {
            activeRooms.push(new Room({ id, token, type: 'ADDON' }))
          }

          const activeRoom = activeRooms.find((room) => room.token === token) as Room

          peer.subscribe(activeRoom.id)
          logger.log(`peer subscribed to room id ${activeRoom.id}`, peer.id)
        }

        if (client === 'SERVER') {
          const activeRoom = activeRooms.find((room) => room.id === id)
          if (!activeRoom) {
            return
          }

          peer.subscribe(activeRoom.id)
          logger.log(`server subscribed to room id ${activeRoom.id}`, peer.id)
        }
      }
      if (parsed.type === 'TEST') {
        peer.publish(parsed.data.id, JSON.stringify({ id: createId(), type: 'TEST' }))
      }
    }
  },

  close(peer, event) {
    logger.log('close', peer.id, JSON.stringify(event))

    // const findIndex = activeRooms.findIndex((room) => room.peer.id === peer.id)
    // activeRooms.splice(findIndex, 1)
  },

  error(peer, error) {
    logger.error('error', peer.id, JSON.stringify(error))
  },
})
