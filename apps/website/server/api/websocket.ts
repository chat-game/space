import type { WebSocketEvents } from '@chat-game/types'
import type { Room } from '~~/types/room'
import { createId } from '@paralleldrive/cuid2'
import { AddonRoom } from '../core/rooms/addon'

const logger = useLogger('ws')
export const activeRooms: Room[] = []

export function sendMessage(message: WebSocketEvents, token: string): void {
  const rooms = activeRooms.filter((room) => room.token === token)

  for (const room of rooms) {
    const preparedMessage = JSON.stringify({ id: createId(), ...message })
    if (room.server.peer?.id) {
      room.server.peer.publish(room.id, preparedMessage)
    }
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
            activeRooms.push(new AddonRoom({ id, token }))
          }

          const activeRoom = activeRooms.find((room) => room.token === token) as AddonRoom

          peer.subscribe(activeRoom.id)
          logger.log(`Peer ${peer.id} subscribed to AddonRoom ${activeRoom.id}`)
        }

        // if (client === 'GAME') {
        //   const token = parsed.data.token
        //   // Create if not exist
        //   if (!activeRooms.find((room) => room.token === token)) {
        //     activeRooms.push(new Room({ id, token, type: 'GAME' }))
        //   }

        //   const activeRoom = activeRooms.find((room) => room.token === token) as Room
        //   if (!activeRoom.peers.includes(peer.id)) {
        //     activeRoom.peers.push(peer.id)
        //   }

        //   peer.subscribe(activeRoom.id)
        //   logger.log(`peer subscribed to room id ${activeRoom.id}`, peer.id)
        // }

        if (client === 'SERVER') {
          const activeRoom = activeRooms.find((room) => room.id === id)
          if (!activeRoom) {
            return
          }

          activeRoom.server.peer = peer
          peer.subscribe(activeRoom.id)
          logger.log(`Server subscribed to Room ${activeRoom.id}`, peer.id)
        }
      }
      if (parsed.type === 'TEST') {
        peer.publish(parsed.data.id, JSON.stringify({ id: createId(), type: 'TEST' }))
      }
      // if (parsed.type === 'NEW_TREE') {
      //   const room = activeRooms.find((room) => room.peers.find((id) => id === peer.id))
      //   if (!room) {
      //     return
      //   }
      //   peer.publish(room.id, JSON.stringify({ id: createId(), type: 'NEW_TREE', data: { id: parsed.data.id, x: parsed.data.x } }))
      //   peer.send(JSON.stringify({ id: createId(), type: 'NEW_TREE', data: { id: parsed.data.id, x: parsed.data.x } }))
      // }
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
