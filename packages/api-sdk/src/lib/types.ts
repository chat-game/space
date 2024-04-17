export interface Village {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  wood: number;
  stone: number;
  globalTarget: number | null;
  globalTargetSuccess: number | null;
}

export type ChatAction =
  | "HELP"
  | "GIFT"
  | "SELL"
  | "BUY"
  | "DONATE"
  | "CHOP"
  | "MINE"
  | "START_GROUP_BUILD"
  | "DISBAND_GROUP"
  | "JOIN_GROUP"
  | "START_CHANGING_SCENE"
  | "START_RAID";

export type ItemType = "WOOD" | "STONE" | "AXE" | "PICKAXE";

export interface IGameRaid {
  raiders: IGameObjectRaider[];
}

export interface IGameInventory {
  id: string;
  objectId: string;
  items: InventoryItem[];
}

export interface InventoryItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  inventoryId: string;
  type: ItemType;
  amount: number;
  durability: number;
}

export interface IGameSkill {
  id: string;
  type: "WOODSMAN" | "MINER";
  objectId: string | null;
  lvl: number;
  xp: number;
  xpNextLvl: number;
}

export interface IGameObject {
  id: string;
  x: number;
  y: number;
  state: IGameObjectState;
  direction: IGameObjectDirection;
  entity: IGameObjectEntity;
  target: IGameObject | undefined;
  health: number;
}

export type IGameObjectState =
  | "MOVING"
  | "IDLE"
  | "CHOPPING"
  | "MINING"
  | "DESTROYED";
export type IGameObjectEntity =
  | undefined
  | "RABBIT"
  | "WOLF"
  | "PLAYER"
  | "RAIDER"
  | "TREE"
  | "STONE"
  | "FLAG";
export type IGameObjectDirection = "LEFT" | "RIGHT";

export interface WebSocketMessage {
  id: string;
  event:
    | "OBJECT_UPDATED"
    | "RAID_STARTED"
    | "GROUP_FORM_STARTED"
    | "SCENE_CHANGING_STARTED"
    | "COUNTDOWN_NEXT_WAVE_STARTED"
    | "SCENE_CHANGED";
  object?: IGameObject;
}

export interface IGameObjectFlag extends IGameObject {
  isOnScreen: boolean;
}

export interface IGameObjectTree extends IGameObject {
  type: "1" | "2" | "3";
  resource: number;
  size: number;
  isReadyToChop: boolean;
}

export interface IGameObjectStone extends IGameObject {
  type: "1";
  resource: number;
  size: number;
}

export interface IGameObjectPlayer extends IGameObject {
  coins: number;
  reputation: number;
  userName: string;
  colorIndex: number;
  inventory: IGameInventory | null;
  skills: IGameSkill[];
}

export interface IGameObjectRaider extends IGameObject {
  userName: string;
  colorIndex: number;
}

export interface IGameObjectRabbit extends IGameObject {}

export interface IGameObjectWolf extends IGameObject {}

export interface IGameEvent {
  id: string;
  title: string;
  type: WebSocketMessage["event"];
  status: "STARTED" | "STOPPED";
  endsAt: Date;
}

export type GameSceneType = "VILLAGE" | "DEFENCE";

export interface GetSceneResponse {
  id: string;
  commands: string[];
  events: IGameEvent[];
  group: IGameGroup | undefined;
}

export interface IGameGroup {
  id: string;
  target: GameSceneType;
  players: IGameObjectPlayer[];
}

export interface PlayerTitle {
  title: string;
  type: "RICH" | "FAMOUS" | "VIEWER" | "WOODSMAN" | "MINER";
}
