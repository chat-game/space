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
    onReboot()
  }

  if (!activeRooms.find((room) => room.id === customRoomId)) {
    activeRooms.push(new WagonRoom({ id: customRoomId, token: customRoomId, onReboot: () => {} }))
  }

  logger.success('Wagon rooms created')
})

function onReboot() {
  const room = new WagonRoom({ id: wagonRoomId, token: wagonRoomId, onReboot })
  if (activeRooms.find((room) => room.id === wagonRoomId)) {
    activeRooms.splice(activeRooms.findIndex((room) => room.id === wagonRoomId), 1)
  }

  activeRooms.push(room)
}
