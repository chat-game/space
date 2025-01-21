import { activeRooms } from '../core/rooms'
import { WagonRoom } from '../core/rooms/wagon'

const wagonRoomId = '12345'
const customRoomId = '123456'

export default defineNitroPlugin(async () => {
  const logger = useLogger('plugin-start-wagon-room')

  // Generate rooms
  const wagonRoom = await useStorage('redis').getItem(`room:${wagonRoomId}:chunks`)
  if (!wagonRoom) {
    await WagonRoom.generate({ chunksCount: 6, roomId: wagonRoomId })
  }

  const customRoom = await useStorage('redis').getItem(`room:${customRoomId}:chunks`)
  if (!customRoom) {
    await WagonRoom.generate({ chunksCount: 2, roomId: customRoomId })
  }

  if (!activeRooms.find((room) => room.id === wagonRoomId)) {
    void rebootRoom()

    setInterval(() => {
      const room = activeRooms.find((room) => room.id === wagonRoomId) as WagonRoom
      if (room.status === 'FINISHED') {
        void rebootRoom()
      }
    }, 2500)
  }

  if (!activeRooms.find((room) => room.id === customRoomId)) {
    activeRooms.push(new WagonRoom({ id: customRoomId }))
  }

  logger.success('Wagon rooms created')
})

async function rebootRoom() {
  if (activeRooms.find((room) => room.id === wagonRoomId)) {
    activeRooms.splice(activeRooms.findIndex((room) => room.id === wagonRoomId), 1)
  }

  await WagonRoom.generate({ chunksCount: 6, roomId: wagonRoomId })

  activeRooms.push(new WagonRoom({ id: wagonRoomId }))
}
