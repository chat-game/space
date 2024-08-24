export default defineEventHandler((event) => {
  const { websiteBearer } = useRuntimeConfig()

  if (event.method !== 'GET') {
    const headers = getHeaders(event)
    const token = headers.authorization ?? headers.Authorization

    // Payment webhook dont need auth
    if (event.path === '/api/payment/webhook') {
      return
    }

    if (event.path === '/api/_auth/session') {
      return
    }

    if (!token || token !== `Bearer ${websiteBearer}`) {
      return createError({
        statusCode: 403,
      })
    }
  }
})
