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

export interface Player {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  lastActionAt: Date;
  x: number;
  y: number;
  userName: string;
  twitchId: string;
  isBusy: boolean;
  colorIndex: number;
  handsItemType: null | "WOOD";
  handsItemAmount: number;
  coins: number;
  reputation: number;
}

export interface Tree {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  x: number;
  y: number;
  size: number;
  resource: number;
  inProgress: boolean;
  progressFinishAt: Date;
  type: string;
}
