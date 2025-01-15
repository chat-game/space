import type { TwitchServiceStatus } from '@chat-game/types'
import type { EventHandlerRequest } from 'h3'
import { twitchController } from '../../utils/twitch/twitch.controller'
import { twitchWoodlandController } from '../../utils/twitch/twitch.woodland.controller'

export default defineEventHandler<EventHandlerRequest, TwitchServiceStatus[]>(() => {
  return [
    { service: 'WOODLAND', status: twitchWoodlandController.status },
    { service: 'HMBANAN666_TWITCH', status: twitchController.status },
    { service: 'COUPON_GENERATOR', status: twitchController.couponGeneratorStatus },
  ]
})
