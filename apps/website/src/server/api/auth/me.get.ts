export default defineEventHandler((event) => {
  const { public: publicEnv } = useRuntimeConfig();

  const jwt = getCookie(event, publicEnv.cookieKey)
  if (!jwt) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return {
    id: '1234',
    twitchId: '12345',
    userName: 'testuser',
  }
});
