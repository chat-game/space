const logger = useLogger('twitch-auth')

export default oauthTwitchEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user }) {
    logger.log(JSON.stringify(user))

    await setUserSession(event, {
      user: {
        id: user.id,
        twitchId: user.id,
        userName: user.userName,
      },
    })
    return sendRedirect(event, '/')
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    logger.error('Twitch OAuth error:', JSON.stringify(error))
    return sendRedirect(event, '/')
  },
})
