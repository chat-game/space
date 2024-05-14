export type IGameSceneAction =
  | "HELP"
  | "GIFT"
  | "SELL"
  | "BUY"
  | "DONATE"
  | "REFUEL"
  | "CHOP"
  | "MINE"
  | "START_GROUP_BUILD"
  | "DISBAND_GROUP"
  | "JOIN_GROUP"
  | "START_CHANGING_SCENE"
  | "START_RAID"
  | "CREATE_NEW_PLAYER"
  | "START_CREATING_NEW_ADVENTURE"
  | "SHOW_MESSAGE"
  | "GITHUB"

export type ItemType = "WOOD" | "STONE" | "AXE" | "PICKAXE"

export interface IGameInventory {
  id: string
  objectId: string
  items: InventoryItem[]
}

export interface InventoryItem {
  id: string
  createdAt: Date
  updatedAt: Date
  inventoryId: string
  type: ItemType
  amount: number
  durability: number
}

export interface IGameSkill {
  id: string
  type: "WOODSMAN" | "MINER"
  objectId: string | null
  lvl: number
  xp: number
  xpNextLvl: number
}

export interface IGameChunk {
  id: string
  title: string
  type: "VILLAGE" | "FOREST" | "LAKE"
  center: {
    x: number
    y: number
  }
  area: IGameObjectArea
  isVisibleOnClient: boolean
}

export type IGameChunkTheme =
  | "GREEN"
  | "TOXIC"
  | "STONE"
  | "TEAL"
  | "BLUE"
  | "VIOLET"

export interface IGameVillageChunk extends IGameChunk {}

export interface IGameForestChunk extends IGameChunk {}

export interface IGameLakeChunk extends IGameChunk {}

export interface IGameObject {
  id: string
  x: number
  y: number
  state: IGameObjectState
  direction: IGameObjectDirection
  entity: IGameObjectEntity
  target: IGameObject | undefined
  health: number
  speed: number
  isVisibleOnClient: boolean
}

export type IGameObjectState =
  | "MOVING"
  | "IDLE"
  | "WAITING"
  | "CHOPPING"
  | "MINING"
  | "DESTROYED"
export type IGameObjectEntity =
  | "RABBIT"
  | "WOLF"
  | "PLAYER"
  | "RAIDER"
  | "TREE"
  | "STONE"
  | "WATER"
  | "LAKE"
  | "FLAG"
  | "AREA"
  | "COURIER"
  | "FARMER"
  | "MECHANIC"
  | "WAGON"
  | IGameObjectBuildingType
export type IGameObjectDirection = "LEFT" | "RIGHT"

export interface WebSocketMessage {
  id: string
  event:
    | "OBJECT_UPDATED"
    | "RAID_STARTED"
    | "GROUP_FORM_STARTED"
    | "SCENE_CHANGING_STARTED"
    | "COUNTDOWN_NEXT_WAVE_STARTED"
    | "SCENE_CHANGED"
    | "CREATING_NEW_ADVENTURE_STARTED"
    | "VOTING_FOR_NEW_ADVENTURE_STARTED"
  object?: Partial<IGameObject>
}

export interface IGameObjectWagon extends IGameObject {
  fuel: number
  visibilityArea: {
    startX: number
    endX: number
    startY: number
    endY: number
  }
}

export type IGameObjectBuildingType = "CAMPFIRE" | "WAREHOUSE" | "WAGON_STOP"

export interface IGameObjectBuilding extends IGameObject {
  inventory: IGameInventory
}

export interface IGameBuildingCampfire extends IGameObjectBuilding {}

export interface IGameBuildingWarehouse extends IGameObjectBuilding {}

export interface IGameBuildingWagonStop extends IGameObjectBuilding {}

export interface IGameObjectFlag extends IGameObject {
  type:
    | "MOVEMENT"
    | "WAGON_MOVEMENT"
    | "WAGON_NEAR_MOVEMENT"
    | "RESOURCE"
    | "SPAWN_LEFT"
    | "SPAWN_RIGHT"
    | "OUT_OF_SCREEN"
}

export interface IGameObjectWater extends IGameObject {}

export interface IGameObjectLake extends IGameObject {
  water: IGameObjectWater[]
}

export interface IGameObjectArea extends IGameObject {
  theme: IGameChunkTheme
  area: {
    startX: number
    endX: number
    startY: number
    endY: number
  }
}

export interface IGameObjectTree extends IGameObject {
  type: "1" | "2" | "3" | "4" | "5"
  variant: IGameChunkTheme
  resource: number
  size: number
  isReadyToChop: boolean
}

export interface IGameObjectStone extends IGameObject {
  type: "1"
  resource: number
  size: number
}

export interface IGameObjectUnit extends IGameObject {
  coins: number
  inventory: IGameInventory
  visual: {
    head: "1"
    hairstyle: "BOLD" | "CLASSIC" | "COAL_LONG"
    top:
      | "VIOLET_SHIRT"
      | "BLACK_SHIRT"
      | "GREEN_SHIRT"
      | "BLUE_SHIRT"
      | "DARK_SILVER_SHIRT"
  }
  dialogue: {
    messages: { id: string; text: string }[]
  }
}

export interface IGameObjectCourier extends IGameObjectUnit {}

export interface IGameObjectFarmer extends IGameObjectUnit {}

export interface IGameObjectMechanic extends IGameObjectUnit {}

export interface IGameObjectPlayer extends IGameObjectUnit {
  reputation: number
  villainPoints: number
  refuellerPoints: number
  userName: string
  skills: IGameSkill[]
  lastActionAt: Date
}

export interface IGameObjectRaider extends IGameObjectUnit {
  userName: string
  colorIndex: number
}

export interface IGameObjectRabbit extends IGameObject {}

export interface IGameObjectWolf extends IGameObject {}

export interface IGameScript {
  id: string
  tasks: IGameTask[]
  live: () => void
}

export interface IGameTask {
  id: string
  status: "IDLE" | "ACTIVE" | "DONE"
  target?: IGameObject
  live: () => void
}

export interface IGameEvent {
  id: string
  title: string
  type: WebSocketMessage["event"]
  status: "STARTED" | "STOPPED"
  endsAt: Date
  poll?: IGamePoll
}

export interface IGamePoll {
  status: "STARTED" | "STOPPED"
  id: string
  votesToSuccess: number
  votes: { id: string; userName: string }[]
}

export type GameSceneType = "VILLAGE" | "DEFENCE" | "MOVING"

export interface GetSceneResponse {
  id: string
  commands: string[]
  chunk: IGameChunk | null
  events: IGameEvent[]
  group: IGameGroup | undefined
  wagon: IGameObjectWagon | undefined
  route: IGameRoute | null
}

export interface IGameGroup {
  id: string
  target: GameSceneType
  players: IGameObjectPlayer[]
}

export interface IGameRoute {
  startPoint: { x: number; y: number }
  endPoint: { x: number; y: number }
  chunks: IGameChunk[]
}

export interface PlayerTitle {
  title: string
  type:
    | "RICH"
    | "FAMOUS"
    | "VIEWER"
    | "VILLAIN"
    | "REFUELLER"
    | "WOODSMAN"
    | "MINER"
}

export type GraphicsContainerType =
  | "INTERFACE"
  | "PLAYER_IDLE"
  | "PLAYER_COINS"
  | "PLAYER_WOOD"
  | "PLAYER_STONE"
  | "PLAYER_AXE"
  | "PLAYER_PICKAXE"
  | "UNIT_TOP"
  | "UNIT_HEAD"
  | "UNIT_HAIR"
  | "WAGON_WHEEL"
  | "WAGON_ENGINE"
  | "WAGON_ENGINE_CLOUD"
  | "FIRE_PARTICLE"
