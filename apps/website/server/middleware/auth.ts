export default defineEventHandler(async (event) => {
  const { websiteBearer } = useRuntimeConfig()

  const session = await getUserSession(event)
  if (session?.user) {
    // Already authenticated
    return
  }

  // Making request with Bearer token
  if (event.method !== 'GET' && event.method !== 'OPTIONS') {
    const headers = getHeaders(event)
    const token = headers.authorization ?? headers.Authorization

    // Payment webhook dont need auth
    if (event.path === '/api/payment/webhook') {
      return
    }

    if (!token || token !== `Bearer ${websiteBearer}`) {
      return createError({
        statusCode: 403,
      })
    }
  }
})
