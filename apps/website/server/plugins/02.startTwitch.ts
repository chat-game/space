import process from 'node:process'
import { twitchAddonController } from '../utils/twitch/twitch.addon.controller'
import { twitchController } from '../utils/twitch/twitch.controller'
import { twitchProvider } from '../utils/twitch/twitch.provider'

export default defineNitroPlugin(() => {
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  const logger = useLogger('plugin-start-twitch')
  const { twitchChannelId } = useRuntimeConfig()

  if (!twitchChannelId) {
    // No config provided
    return
  }

  twitchController.serve()
  twitchController.serveStreamOnline()
  twitchAddonController.serve()

  setTimeout(checkIfStreamingNow, 8000)

  logger.success('Twitch server started')
})

async function checkIfStreamingNow() {
  const res = await fetch('https://twitch.tv/hmbanan666')
  const code = await res.text()

  if (code.includes('isLiveBroadcast')) {
    twitchProvider.isStreaming = true
  }
}
