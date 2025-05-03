export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const chargeRoom = chargeRooms.find((room) => room.id === id)
  if (!chargeRoom) {
    throw createError({
      status: 404,
    })
  }

  return {
    id: chargeRoom.id,
    startedAt: chargeRoom.startedAt,
    energy: chargeRoom.energy,
    rate: chargeRoom.rate,
    ratePerMinute: chargeRoom.ratePerMinute,
    difficulty: chargeRoom.difficulty,
    messagesCount: chargeRoom.messages.length,
  }
})
