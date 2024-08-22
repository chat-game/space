export interface Profile {
  id: string
  createdAt: Date
  updatedAt: Date
  twitchId: string
  userName: string
  isStreamer: boolean
  coupons: number
  coins: number
  level: number
  mana: number
  points: number
  patronPoints: number
  trophyHunterPoints: number
  rangerPoints: number
  storytellerPoints: number
  collectorPoints: number
  activeEditionId: string
}

export interface ProfileWithTokens extends Profile {
  twitchTokens: TwitchToken[]
}

export interface ProfileWithOwnedCharacters extends Profile {
  characterEditions: CharacterEditionWithCharacter[]
}

export interface ProfileInfoResponse {
  count: number
}

export interface ProfileCreateRequest {
  data: {
    twitchId: string
    userName: string
  }
}

export interface ProfileCreateResponse {
  ok: boolean
  result: Profile
}

export interface TokenCreateRequest {
  data: {
    code: string
    profileId: string
  }
}

export interface AddonTokenCreateRequest {
  data: {
    profileId: string
  }
}

export interface TokenCreateResponse {
  ok: boolean
  result: TwitchToken
}

export interface StreamerUpdateResponse {
  ok: boolean
}

export interface TwitchToken {
  id: string
  createdAt: Date
  updatedAt: Date
  onlineAt: Date
  status: 'ACTIVE' | 'INACTIVE'
  type: 'ADDON' | 'AI_VIEW' | 'WOODLAND'
  points: number
  language: 'ru' | 'en'
  profileId: string
  accessTokenId: string | null
}

export interface TwitchTokenWithProfile extends TwitchToken {
  profile: Profile
}

export interface Character {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  nickname: string
  profileId: string
  gameId: string
  isReady: boolean
  unlockedBy: 'COINS' | 'SHOP' | 'TROPHY'
  price: number
  codename: string | null
  animationIdle: string | null
  animationMoving: string | null
}

export interface CharacterWithProfile extends Character {
  profile: Profile
  editions: CharacterEdition[]
}

export interface CharacterWithEditions extends Character {
  editions: CharacterEdition[]
}

export interface CharacterEdition {
  id: string
  createdAt: Date
  updatedAt: Date
  level: number
  xp: number
  profileId: string
  characterId: string
}

export interface CharacterEditionWithCharacter extends CharacterEdition {
  character: Character
}

export interface CharacterEditionWithProfile extends CharacterEdition {
  profile: Profile
  character: Character
}

export interface ActiveCharacter extends CharacterEditionWithCharacter {
  lastActionAt: Date
  token: string
  playerId: string
}

export interface CharacterEditionCreateRequest {
  data: {
    profileId: string
  }
}

export interface CharacterPostCreateRequest {
  data: {
    profileId: string
    text: string
  }
}

export interface Game {
  id: string
  createdAt: Date
  updatedAt: Date
  slug: string
  title: string
  imageId: string
  charactersCount: number
}

export interface GameWithCharacters extends Game {
  characters: Character[]
}

export interface Trophy {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  points: number
  profileId: string
  rarity: number
  isReady: boolean
}

export interface TrophyEdition {
  id: string
  createdAt: Date
  updatedAt: Date
  profileId: string
  trophyId: string
}

export interface TrophyWithEditions extends Trophy {
  profile: Profile
  editions: TrophyEditionWithProfile[]
}

export interface TrophyEditionWithTrophy extends TrophyEdition {
  trophy: Trophy
}

export interface TrophyEditionWithProfile extends TrophyEdition {
  profile: Profile
}

export interface TrophyCreateRequest {
  data: {
    profileId: string
    name: string
    description: string
  }
}

export interface TrophyCreateResponse {
  ok: boolean
  result: Trophy
}

export interface Quest {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  profileId: string
  points: number
  progressCompleted: number
}

export interface QuestEdition {
  id: string
  createdAt: Date
  updatedAt: Date
  completedAt: Date | null
  profileId: string
  questId: string
  progress: number
  status: 'IN_PROGRESS' | 'COMPLETED'
}

export interface QuestReward {
  id: string
  createdAt: Date
  updatedAt: Date
  questId: string
  type: 'COINS' | 'TROPHY'
  amount: number
  entityId: string | null
}

export interface QuestEditionWithProfile extends QuestEdition {
  profile: Profile
}

export interface QuestWithEditions extends Quest {
  editions: QuestEditionWithProfile[]
  rewards: QuestReward[]
  profile: Profile
}

export interface QuestWithRewards extends Quest {
  rewards: QuestReward[]
}

export interface Post {
  id: string
  createdAt: Date
  updatedAt: Date
  profileId: string
  characterId: string
  type: 'NOTE'
  text: string
  profile: Profile
  rating: number
  likes: Like[]
}

export interface Like {
  id: string
  createdAt: Date
  updatedAt: Date
  profileId: string
  postId: string
}

export interface PostLikeCreateRequest {
  data: {
    profileId: string
  }
}

export interface Coupon {
  id: string
  createdAt: Date
  updatedAt: Date
  activationCommand: string
  status: 'CREATED' | 'TAKEN'
  profileId: string | null
}

export interface ConvertCouponRequest {
  data: {
    profileId: string
    type: 'COINS'
  }
}

export interface Player {
  id: string
  createdAt: Date
  updatedAt: Date
  lastActionAt: Date
  name: string
  coins: number
  reputation: number
  viewerPoints: number
  villainPoints: number
  refuellerPoints: number
  raiderPoints: number
  inventoryId: string
  profileId: string
}

export interface Inventory {
  id: string
  createdAt: Date
  updatedAt: Date
  objectId: string
  items: InventoryItem[]
}

export interface InventoryItem {
  id: string
  createdAt: Date
  updatedAt: Date
  inventoryId: string
  type: InventoryItemType
  amount: number
  durability: number
}

export type InventoryItemType = 'WOOD' | 'STONE' | 'AXE' | 'PICKAXE' | 'COIN'

export type WebSocketMessage = { id: string } & WebSocketEvents

export type WebSocketEvents =
  | WebSocketEventCommand
  | WebSocketEventMessage
  | WebSocketEventLevelUp
  | WebSocketWoodlandMessage
  | WebSocketWoodlandCommand

export interface WebSocketEventCommand {
  type: 'COMMAND'
  data: {
    command: string
    params: string[]
    player: Player
    profile: Profile
    character: CharacterEditionWithCharacter
    text: string
  }
}

export interface WebSocketEventMessage {
  type: 'MESSAGE'
  data: {
    player: Player
    profile: Profile
    character: CharacterEditionWithCharacter
    text: string
  }
}

export interface WebSocketEventLevelUp {
  type: 'LEVEL_UP'
  data: {
    text: string
    playerId: string
  }
}

export interface WebSocketWoodlandCommand {
  type: 'WOODLAND_COMMAND'
  data: {
    command: string
    params: string[]
    player: WoodlandPlayer
    profile: Profile
    character: CharacterEditionWithCharacter
    text: string
  }
}

export interface WebSocketWoodlandMessage {
  type: 'WOODLAND_MESSAGE'
  data: {
    player: WoodlandPlayer
    profile: Profile
    character: CharacterEditionWithCharacter
    text: string
  }
}

export interface TwitchServiceStatus {
  service: 'PUBLIC_ADDON' | 'HMBANAN666_TWITCH' | 'COUPON_GENERATOR' | 'AI_VIEW' | 'WOODLAND'
  status: 'RUNNING' | 'STOPPED'
}

export interface Transaction {
  id: string
  createdAt: Date
  updatedAt: Date
  profileId: string
  entityId: string
  amount: number
  type:
    | 'CHARACTER_UNLOCK'
    | 'COIN_FROM_LVL_UP'
    | 'COINS_FROM_COUPON'
    | 'COINS_FROM_QUEST'
    | 'POINTS_FROM_LEVEL_UP'
    | 'POINTS_FROM_CHARACTER_UNLOCK'
  text: string | null
}

export interface TransactionWithProfile extends Transaction {
  profile: Profile
}

export interface Woodland {
  id: string
  createdAt: Date
  updatedAt: Date
  finishedAt: Date | null
  profileId: string
  tokenId: string
  status: 'CREATED' | 'STARTED' | 'FINISHED'
  players: WoodlandPlayer[]
}

export interface WoodlandPlayer {
  id: string
  createdAt: Date
  updatedAt: Date
  lastActionAt: Date
  name: string
  wood: number
  woodlandId: string
  profileId: string
}

export interface WoodlandCreateRequest {
  data: {
    profileId: string
  }
}

export interface WoodlandCreateResponse {
  ok: boolean
  result: {
    token: TwitchToken
    woodland: Woodland
  }
}

export interface WoodlandUpdatePlayerRequest {
  data: {
    wood: number
  }
}

export interface Payment {
  id: string
  createdAt: Date
  updatedAt: Date
  profileId: string
  productId: string
  status: 'PENDING' | 'PAID'
  externalId: string
  provider: 'YOOKASSA'
  amount: number
}

export interface PaymentCreateRequest {
  data: {
    profileId: string
    productId: string
  }
}

export interface PaymentCreateResponse {
  ok: boolean
  result: {
    payment: Payment
    redirectUrl: string
  }
}

export interface TwitchAccessTokenResponse {
  access_token: string
  refresh_token: string
  scope: string[]
  expires_in: number
  token_type: 'bearer'
}

export interface TwitchAccessToken {
  id: string
  userId: string
  accessToken: string
  refreshToken: string | null
  scope: string[]
  expiresIn: number | null
  obtainmentTimestamp: number
}

export interface WebsiteProfile {
  id: string
  twitchId: string
  userName: string
}