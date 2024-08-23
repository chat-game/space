export default defineEventHandler((event) => {
  const { public: publicEnv } = useRuntimeConfig()

  const token = getCookie(event, publicEnv.cookieKey)
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  deleteCookie(event, publicEnv.cookieKey, { path: '/' })

  return { ok: true }
})
