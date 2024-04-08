export interface Village {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  wood: number;
  stone: number;
  globalTarget: number | null;
  globalTargetSuccess: number | null;
}

export interface Command {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  playerId: string;
  command: string;
  player?: Player;
}

export type TargetType = "TREE" | "STONE";

export interface Player {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  lastActionAt: Date;
  x: number;
  y: number;
  targetX: number | null;
  targetY: number | null;
  targetId: string | null;
  userName: string;
  twitchId: string;
  isBusy: boolean;
  businessType: PlayerBusinessType;
  colorIndex: number;
  handsItemType: null | ItemType;
  handsItemAmount: number;
  coins: number;
  reputation: number;
}

export type PlayerBusinessType = null | "RUNNING" | "CHOPPING" | "MINING";

export type ItemType = "WOOD" | "STONE" | "AXE" | "PICKAXE";

export interface Inventory {
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

export interface Tree {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  x: number;
  y: number;
  size: number;
  resource: number;
  isReserved: boolean;
  inProgress: boolean;
  progressFinishAt: Date;
  type: "1" | "2" | "3";
}

export interface Stone {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  x: number;
  y: number;
  size: number;
  resource: number;
  isReserved: boolean;
  inProgress: boolean;
  progressFinishAt: Date;
  type: "1";
}

export interface Skill {
  id: string;
  type: SkillType | null;
  objectId: string | null;
  lvl: number;
  xp: number;
  xpNextLvl: number;
}

export type SkillType = "WOODSMAN" | "MINER";

export interface GameObject {
  id: string;
  x: number;
  y: number;
  state: "MOVING" | "IDLE" | "CHOPPING" | "MINING" | "DESTROYED";
  direction: "LEFT" | "RIGHT";
  entity: GameObjectEntity;
}

export type GameObjectEntity = undefined | "RABBIT" | "WOLF" | "PLAYER" | "TREE" | "STONE" | "FLAG";

export interface WebSocketMessage {
  id: string;
  type: "object",
  action?: "isOnTarget",
  object?: GameObject
}

export interface GameObjectTree extends GameObject {
  type: GameObjectTreeType;
  resource: number;
  size: number;
  health: number;
  isReadyToChop: boolean;
}

export type GameObjectTreeType = "1" | "2" | "3";

export interface GameObjectStone extends GameObject {
  type: "1";
  resource: number;
  size: number;
  health: number;
}

export interface GameObjectPlayer extends GameObject {
  coins: number;
  reputation: number;
  userName: string;
  colorIndex: number;
  inventory: Inventory | null;
  skills: Skill[];
}
