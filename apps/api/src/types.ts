export interface Command {
	id: string;
	userId: string;
	userName: string;
	command: string;
	createdAt: number;
}

export interface Player {
	id: string;
	x: number;
	y: number;
	userName: string;
}
