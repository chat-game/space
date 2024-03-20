import { createId } from "@paralleldrive/cuid2";
import { db } from "./db.client.ts";

export function createPlayer(dto: { twitchId: string; userName: string }) {
	return db.player.create({
		data: {
			id: createId(),
			twitchId: dto.twitchId,
			userName: dto.userName,
			x: 600,
			y: 600,
		},
	});
}

export function updatePlayer(dto: { twitchId: string; x: number; y: number }) {
	return db.player.updateMany({
		where: { twitchId: dto.twitchId },
		data: {
			x: dto.x,
			y: dto.y,
		},
	});
}

export async function findOrCreatePlayer({
	twitchId,
	userName,
}: { twitchId: string; userName: string }) {
	const player = await db.player.findFirst({
		where: { twitchId },
	});
	if (!player) {
		// Create new one!
		return createPlayer({ twitchId, userName });
	}

	// Already in DB
	return player;
}

export function findActivePlayers() {
	// Active = 10 minutes?
	const time = new Date();
	const milliseconds = 10 * 60 * 1000;
	const lastActionAt = new Date(time.getTime() - milliseconds);

	return db.player.findMany({
		where: { lastActionAt: { gte: lastActionAt } },
	});
}

export function createCommand(dto: {
	playerId: string;
	command: string;
	target: string;
}) {
	return db.command.create({
		data: {
			id: createId(),
			playerId: dto.playerId,
			command: dto.command,
			target: dto.target,
		},
	});
}

export function findCommands() {
	return db.command.findMany({
		orderBy: { createdAt: "desc" },
		take: 10,
		include: {
			player: true,
		},
	});
}

export function findTrees() {
	return db.tree.findMany();
}

export function findTreeToChop() {
	return db.tree.findFirst({
		where: {
			size: { gte: 80 },
			inProgress: false,
		},
		orderBy: {
			progressFinishAt: "asc",
		},
	});
}

export function updateTree(dto: { id: string; size: number }) {
	return db.tree.update({
		where: { id: dto.id },
		data: {
			size: dto.size,
		},
	});
}

export async function growTrees() {
	const treesCanGrow = await db.tree.findMany({
		where: { size: { lt: 100 } },
	});

	for (const tree of treesCanGrow) {
		// Random to resource
		let resource = 0;
		const rand = Math.random();
		if (rand < 0.03) {
			// 3% chance to +1 resource
			resource = 1;
		}

		// +1 to size
		await db.tree.update({
			where: { id: tree.id },
			data: {
				size: {
					increment: 1,
				},
				resource: {
					increment: resource,
				},
			},
		});
	}
}

export async function setTreeInProgress(id: string) {
	const tree = await db.tree.findUnique({
		where: { id },
	});
	if (!tree) {
		return null;
	}

	// 30 seconds to chop?
	const time = new Date();
	const milliseconds = 30 * 1000;
	const progressFinishAt = new Date(time.getTime() + milliseconds);

	return db.tree.update({
		where: { id },
		data: {
			progressFinishAt,
			inProgress: true,
		},
	});
}

export function setPlayerChopping(dto: { id: string; x: number; y: number }) {
	return db.player.update({
		where: { id: dto.id },
		data: {
			x: dto.x,
			y: dto.y,
			isBusy: true,
			lastActionAt: new Date(),
		},
	});
}

export async function findCompletedTrees() {
	const trees = await db.tree.findMany({
		where: {
			inProgress: true,
			progressFinishAt: {
				lte: new Date(),
			},
		},
	});
	for (const tree of trees) {
		console.log(tree.id, `${tree.resource} resource`, "tree completed");

		// Add resource to Village
		await db.village.updateMany({
			data: {
				wood: {
					increment: tree.resource,
				},
			},
		});

		// Global target
		const village = await findVillage();
		if (village?.globalTargetSuccess && village?.globalTarget) {
			const plusToTarget =
				village.globalTargetSuccess >= village.globalTarget + tree.resource
					? tree.resource
					: 0;

			await db.village.updateMany({
				data: {
					globalTarget: {
						increment: plusToTarget,
					},
				},
			});
		}

		// Get command
		const command = await db.command.findFirst({
			where: { target: tree.id },
			orderBy: { createdAt: "desc" },
		});
		if (command) {
			// Player is free now
			await db.player.update({
				where: { id: command.playerId },
				data: {
					isBusy: false,
				},
			});
		}

		// Destroy tree
		await db.tree.update({
			where: { id: tree.id },
			data: {
				inProgress: false,
				resource: 0,
				size: 0,
			},
		});
	}
}

export function findVillage() {
	return db.village.findFirst();
}
