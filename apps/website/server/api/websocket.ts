import type { CharacterEditionWithCharacter, GameObject, GameObjectPlayer, WebSocketEvents } from '@chat-game/types'
import type { WagonRoom } from '../core/rooms/wagon'
import { createId } from '@paralleldrive/cuid2'
import { dropChristmasCupcake } from '../core/inventory/drop'
import { activeRooms } from '../core/rooms'
import { AddonRoom } from '../core/rooms/addon'

const logger = useLogger('ws')

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

        if (client === 'TELEGRAM_CLIENT') {
          if (!activeRooms.find((room) => room.id === id)) {
            return
          }

          const activeRoom = activeRooms.find((room) => room.id === id) as WagonRoom
          if (!activeRoom.peers.includes(peer.id)) {
            activeRoom.peers.push(peer.id)
          }

          // add to objects
          const wagon = activeRoom.objects.find((obj) => obj.type === 'WAGON')
          const telegramProfile = await prisma.telegramProfile.findFirst({
            where: { telegramId: parsed.data.token },
            include: {
              profile: true,
            },
          })
          const activeEditionId = telegramProfile?.profile?.activeEditionId
          const character = await prisma.characterEdition.findFirst({
            where: { id: activeEditionId },
            include: { character: true },
          }) as CharacterEditionWithCharacter | null
          if (!character) {
            return
          }

          // Check, if already exists by Telegram
          const playerExist = activeRoom.objects.find((obj) => obj.type === 'PLAYER' && obj.telegramId === parsed.data.token)
          if (playerExist) {
            return
          }

          activeRoom.addPlayer({ id: peer.id, telegramId: parsed.data.token, x: wagon?.x ? wagon.x - 200 : 100, character })

          peer.subscribe(activeRoom.id)
          void sendMessage({ type: 'CONNECTED_TO_WAGON_ROOM', data: { type: 'PLAYER', id: peer.id, objects: activeRoom.objects } }, activeRoom.token)

          logger.log(`Telegram client ${parsed.data.token} subscribed to Wagon Room ${activeRoom.id}`, peer.id)
        }

        if (client === 'WAGON_CLIENT') {
          const activeRoom = activeRooms.find((room) => room.id === id) as WagonRoom
          if (!activeRoom.peers.includes(peer.id)) {
            activeRoom.peers.push(peer.id)
          }

          peer.subscribe(activeRoom.id)
          void sendMessage({ type: 'CONNECTED_TO_WAGON_ROOM', data: { type: 'WAGON', id: peer.id, objects: activeRoom.objects } }, activeRoom.token)

          logger.log(`Wagon client subscribed to Wagon Room ${activeRoom.id}`, peer.id)
        }

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
      if (parsed.type === 'NEW_WAGON_TARGET' || parsed.type === 'NEW_PLAYER_TARGET' || parsed.type === 'NEW_TREE' || parsed.type === 'DESTROY_TREE') {
        const activeRoom = activeRooms.find((room) => room.peers.find((id) => id)) as WagonRoom
        if (!activeRoom) {
          return
        }

        // Update object
        if (parsed.type === 'NEW_WAGON_TARGET') {
          const wagon = activeRoom.objects.find((obj) => obj.type === 'WAGON')
          if (wagon) {
            wagon.x = parsed.data.x
          }
        }
        if (parsed.type === 'NEW_PLAYER_TARGET') {
          const player = activeRoom.objects.find((obj) => obj.type === 'PLAYER' && obj.id === parsed.data.id)
          if (player) {
            player.x = parsed.data.x
          }
        }
        if (parsed.type === 'NEW_TREE') {
          const tree = activeRoom.objects.find((obj) => obj.type === 'TREE' && obj.id === parsed.data.id)
          if (!tree) {
            activeRoom.addTree({ ...parsed.data })
          }
        }
        if (parsed.type === 'DESTROY_TREE') {
          const tree = activeRoom.objects.find((obj) => obj.type === 'TREE' && obj.id === parsed.data.id)
          if (tree) {
            activeRoom.removeObject(parsed.data.id)

            const player = activeRoom.objects.find((obj) => obj.type === 'PLAYER' && obj.id === peer.id) as GameObject & GameObjectPlayer
            if (player) {
              await dropChristmasCupcake(player.telegramId, 'TREE')
            }
          }
        }

        peer.publish(activeRoom.id, JSON.stringify({ id: createId(), type: parsed.type, data: parsed.data }))
      }
    }
  },

  close(peer, event) {
    logger.log('close', peer.id, JSON.stringify(event))

    // Remove peer from peers array
    const room = activeRooms.find((room) => room.peers.find((id) => id === peer.id))
    if (room) {
      // if player - remove from objects
      if (room.type === 'WAGON') {
        const wagonRoom = room as WagonRoom
        const player = wagonRoom.objects.find((obj) => obj.type === 'PLAYER' && obj.id === peer.id)
        if (player) {
          wagonRoom.removeObject(player.id)
        }

        void sendMessage({ type: 'DISCONNECTED_FROM_WAGON_ROOM', data: { id: peer.id } }, room.token)
      }

      room.peers = room.peers.filter((id) => id !== peer.id)
    }
  },

  error(peer, error) {
    logger.error('error', peer.id, JSON.stringify(error))
  },
})
