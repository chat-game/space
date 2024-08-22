import type { EventHandlerRequest } from 'h3'
import { twitchAddonController } from '../../utils/twitch/twitch.addon.controller'
import { twitchController } from '../../utils/twitch/twitch.controller'
import { twitchWoodlandController } from '../../utils/twitch/twitch.woodland.controller'
import type { TwitchServiceStatus } from '@chat-game/types'

export default defineEventHandler<EventHandlerRequest, TwitchServiceStatus[]>(() => {
  return [
    { service: 'PUBLIC_ADDON', status: twitchAddonController.status },
    { service: 'WOODLAND', status: twitchWoodlandController.status },
    { service: 'HMBANAN666_TWITCH', status: twitchController.status },
    { service: 'COUPON_GENERATOR', status: twitchController.couponGeneratorStatus },
  ]
})
