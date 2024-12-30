import redisDriver from 'unstorage/drivers/redis'

export default defineNitroPlugin(() => {
  const logger = useLogger('plugin-connect-storage')
  const storage = useStorage()

  // Dynamically pass in credentials from runtime configuration, or other sources
  const driver = redisDriver({
    base: 'redis',
    url: useRuntimeConfig().redisUrl,
  })

  // Mount driver
  storage.mount('redis', driver)

  logger.success('Storage connected')
})
