import { twitchProvider } from '../utils/twitch/twitch.provider'

export default defineNitroPlugin(() => {
  // void twitchController.serve()
  // void twitchController.serveStreamOnline()
  // void twitchAddonController.serve()
  // void twitchWoodlandController.serve()

  setTimeout(checkIfStreamingNow, 5000)
})

async function checkIfStreamingNow() {
  const res = await fetch('https://twitch.tv/hmbanan666')
  const code = await res.text()

  if (code.includes('isLiveBroadcast')) {
    twitchProvider.isStreaming = true
  }
}
