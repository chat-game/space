import type { Charge } from '~~/types/charge'
import { StreamCharge } from '../core/charge/stream'

export const chargeRooms: StreamCharge[] = []

export async function initCharges() {
  const logger = useLogger('plugin-start-stream-charges')

  const keys = await useStorage('redis').getKeys()
  const chargeKeys = keys.filter((key) => key.startsWith('charge:'))

  const storage = new Map<string, Promise<Charge | null>>(chargeKeys.map((key) => [key, useStorage<Charge>('redis').getItem(key)]))
  const charges: Charge[] = []

  await Promise.allSettled(
    chargeKeys.map(async (key) => {
      const c = await storage.get(key)
      if (!c) {
        return
      }

      charges.push(c)
    }))

  for (const charge of charges) {
    chargeRooms.push(new StreamCharge({
      ...charge,
    }))
  }

  logger.success('Stream charges created')
}
