export default defineNitroPlugin(() => {
  const logger = useLogger('plugin-start-twitch')
  const { twitchChannelId } = useRuntimeConfig()

  if (!twitchChannelId) {
    // No config provided
    return
  }

  void twitchController.serve()
  void twitchController.serveStreamOnline()
  void twitchAddonController.serve()
  void twitchWoodlandController.serve()

  setTimeout(checkIfStreamingNow, 8000)

  logger.log('Twitch server started')
})

async function checkIfStreamingNow() {
  const res = await fetch('https://twitch.tv/hmbanan666')
  const code = await res.text()

  if (code.includes('isLiveBroadcast')) {
    twitchProvider.isStreaming = true
  }
}
