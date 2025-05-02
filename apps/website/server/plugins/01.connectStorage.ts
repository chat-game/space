import redisDriver from 'unstorage/drivers/redis'

export default defineNitroPlugin(async () => {
  const logger = useLogger('plugin-connect-storage')
  const storage = useStorage()

  // Dynamically pass in credentials from runtime configuration, or other sources
  const driver = redisDriver({
    url: useRuntimeConfig().redisUrl,
  })

  // Mount driver
  storage.mount('redis', driver)

  logger.success('Storage connected')

  await initCharges()
})
