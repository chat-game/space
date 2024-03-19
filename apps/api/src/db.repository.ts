import { createId } from "@paralleldrive/cuid2";
import { db } from "./db.client.ts";

export function createPlayer(dto: { twitchId: string; userName: string }) {
	return db.player.create({
		data: {
			id: createId(),
			twitchId: dto.twitchId,
			userName: dto.userName,
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
	return db.player.findMany();
}
