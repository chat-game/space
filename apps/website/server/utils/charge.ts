import type { Charge } from '~~/types/charge'
import { StreamCharge } from '../core/charge/stream'
import { DonateController } from '../core/donate/controller'
import { TwitchChatController } from './twitch/chat.controller'

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
    const chargeInstance = new StreamCharge(
      charge,
      new TwitchChatController({ streamName: charge.twitchStreamName }),
      new TwitchSubController(),
      new DonateController({ userId: '367101' }),
    )
    chargeRooms.push(chargeInstance)
  }

  logger.success('Stream charges created')
}
