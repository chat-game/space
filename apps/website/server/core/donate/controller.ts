import { ApiClient } from '@donation-alerts/api'
import { RefreshingAuthProvider } from '@donation-alerts/auth'
import { UserEventsClient } from '@donation-alerts/events'

interface DonateControllerOptions {
  userId: string
}

export class DonateController {
  userId: string
  client!: UserEventsClient
  readonly #repository = new DBRepository()

  constructor(data: DonateControllerOptions) {
    this.userId = data.userId
  }

  async init() {
    const {
      donationAlertsClientId,
      donationAlertsClientSecret,
    } = useRuntimeConfig()

    const scopes = [
      'oauth-user-show', // Access user profile information
      'oauth-donation-index', // Access donation history
      'oauth-donation-subscribe', // Subscribe to real-time donation events
      'oauth-custom_alert-store', // Send custom alerts
    ]

    const authProvider = new RefreshingAuthProvider({
      clientId: donationAlertsClientId,
      clientSecret: donationAlertsClientSecret,
      redirectUri: 'http://localhost:3000',
      scopes,
    })

    authProvider.onRefresh(async (userId, newTokenData) => {
      await this.#repository.updateTwitchAccessToken(userId.toString(), newTokenData)
    })

    const accessToken = await this.#repository.getTwitchAccessToken(this.userId)
    if (!accessToken) {
      throw new Error('No access token')
    }

    authProvider.addUser(this.userId, {
      accessToken: accessToken.accessToken,
      refreshToken: accessToken.refreshToken as string,
      expiresIn: 0,
      obtainmentTimestamp: 0,
      scopes,
    })

    const apiClient = new ApiClient({
      authProvider,
    })

    this.client = new UserEventsClient({
      user: this.userId,
      apiClient,
    })
  }
}
