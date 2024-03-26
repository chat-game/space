export interface Village {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  wood: number;
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
  skillWoodLvl: number;
  skillWoodNextLvl: number;
  skillWood: number;
  skillMiningLvl: number;
  skillMiningNextLvl: number;
  skillMining: number;
}

export type PlayerBusinessType = null | "RUNNING" | "CHOPPING" | "MINING";

export type SkillType = "WOOD" | "MINING";

export type ItemType = "WOOD" | "STONE" | "AXE" | "PICKAXE";

export interface InventoryItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  playerId: string;
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
