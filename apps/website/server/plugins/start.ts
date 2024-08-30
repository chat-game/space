export default defineNitroPlugin(() => {
  const logger = useLogger('plugin-start')
  const { twitchChannelId } = useRuntimeConfig()

  if (!twitchChannelId) {
    // No config provided
    return
  }

  void twitchController.serve()
  void twitchController.serveStreamOnline()
  void twitchAddonController.serve()
  void twitchWoodlandController.serve()

  setTimeout(checkIfStreamingNow, 5000)

  logger.info('Twitch server started')
})

async function checkIfStreamingNow() {
  const res = await fetch('https://twitch.tv/hmbanan666')
  const code = await res.text()

  if (code.includes('isLiveBroadcast')) {
    twitchProvider.isStreaming = true
  }
}
