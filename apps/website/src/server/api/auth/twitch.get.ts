export default defineEventHandler((event) => {
  const { public: publicEnv } = useRuntimeConfig()
  const query = getQuery(event)

  if (!query.code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing code',
    })
  }

  const code = query.code.toString()

  log(JSON.stringify(query))

  setCookie(event, publicEnv.cookieKey, code, {
    path: '/',
    httpOnly: true,
  })

  sendRedirect(event, '/')
})
