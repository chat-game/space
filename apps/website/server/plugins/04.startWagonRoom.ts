import { activeRooms } from '../core/rooms'
import { WagonRoom } from '../core/rooms/wagon'

const wagonRoomId = '12345'

export default defineNitroPlugin(async () => {
  const logger = useLogger('plugin-start-wagon-room')

  if (!activeRooms.find((room) => room.id === wagonRoomId)) {
    activeRooms.push(new WagonRoom({ id: wagonRoomId, token: wagonRoomId }))
  }

  logger.success('Wagon room created')
})
