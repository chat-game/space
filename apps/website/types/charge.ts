export interface Charge {
  id: string
  startedAt: string
  energy: number
  rate: number
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
