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
