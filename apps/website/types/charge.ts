export interface Charge {
  id: string
  startedAt: string
  energy: number
  baseRate: number
  difficulty: number
  twitchStreamId: string
  twitchStreamName: string
}

export interface ChargeModifier {
  id: string
  createdAt: number
  expiredAt: number
  code: string
  userName: string
  isExpired: boolean
}
