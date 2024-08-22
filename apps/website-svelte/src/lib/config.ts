import { z } from 'zod'
import { env as publicEnv } from '$env/dynamic/public'

/**
 * This is where the application configuration schema is declared.
 * Contains only public environment variables.
 *
 * Private environment variables are stored in '$env/dynamic/private'
 * According to security policy, they should not be available on the client.
 * Every use of a private environment variable must be done manually.
 */

const allEnv = z.object({
  PUBLIC_COOKIE_KEY: z.string().default(''),
  PUBLIC_SIGNIN_REDIRECT_URL: z.string().default(''),
  PUBLIC_WEBSOCKET_URL: z.string().default(''),
  PUBLIC_DONATE_URL: z.string().default('https://www.donationalerts.com/r/hmbanan666'),
  PUBLIC_GITHUB_REPO_URL: z.string().default('https://github.com/chat-game/app'),
  PUBLIC_DISCORD_SERVER_INVITE_URL: z.string().default('https://discord.gg/B6etUajrGZ'),
  PUBLIC_GAME_ADMIN_PLAYER_ID: z.string().default('svhjz9p5467wne9ybasf1bwy'),
  PUBLIC_TWITCH_CLIENT_ID: z.string().default(''),
  PUBLIC_TWITCH_URL: z.string().default('https://www.twitch.tv/hmbanan666'),
  PUBLIC_TWITCH_CHANNEL_REWARDS: z.string().default(
    JSON.stringify({
      add150ViewerPointsId: 'd8237822-c943-434f-9d7e-87a9f549f4c4',
      villainStealFuelId: 'd5956de4-54ff-49e4-afbe-ee4e62718eee',
      addNewIdea: '289457e8-18c2-4b68-8564-fc61dd60b2a2',
    })
  ),
})

const ConfigSchema = allEnv.transform((value) => {
  return {
    cookieKey: value.PUBLIC_COOKIE_KEY,
    signInRedirectUrl: value.PUBLIC_SIGNIN_REDIRECT_URL,
    websocketUrl: value.PUBLIC_WEBSOCKET_URL,
    donateUrl: value.PUBLIC_DONATE_URL,
    githubRepoUrl: value.PUBLIC_GITHUB_REPO_URL,
    discordServerInviteUrl: value.PUBLIC_DISCORD_SERVER_INVITE_URL,
    game: {
      adminPlayerId: value.PUBLIC_GAME_ADMIN_PLAYER_ID,
    },
    twitch: {
      clientId: value.PUBLIC_TWITCH_CLIENT_ID,
      url: value.PUBLIC_TWITCH_URL,
      rewards: JSON.parse(value.PUBLIC_TWITCH_CHANNEL_REWARDS),
    },
  }
})

export type Config = z.infer<typeof ConfigSchema>
export const config: Config = ConfigSchema.parse(publicEnv)
