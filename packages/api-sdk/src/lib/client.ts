import type { Command, Player, Tree, Village } from "./types";

export async function getVillage() {
	try {
		const res = await fetch("http://localhost:4001/village");
		return (await res.json()) as Village;
	} catch (err) {
		return null;
	}
}

export async function getCommands() {
	try {
		const res = await fetch("http://localhost:4001/commands");
		return (await res.json()) as Command[];
	} catch (err) {
		return null;
	}
}

export async function getPlayers() {
	try {
		const res = await fetch("http://localhost:4001/players");
		return (await res.json()) as Player[];
	} catch (err) {
		return null;
	}
}

export async function getTrees() {
	try {
		const res = await fetch("http://localhost:4001/trees");
		return (await res.json()) as Tree[];
	} catch (err) {
		return null;
	}
}

export async function findTreeToChop() {
	try {
		const res = await fetch("http://localhost:4001/trees/chop");
		return (await res.json()) as Tree;
	} catch (err) {
		return null;
	}
}

export const updateTree = async ({
	id,
	size,
}: { id: string; size: number }) => {
	const res = await fetch(`http://localhost:4001/trees/${id}`, {
		method: "PATCH",
		body: JSON.stringify({
			size,
		}),
	});
	return res.json();
};

export const createPlayer = async ({
	id,
	userName,
}: { id: string; userName: string }) => {
	const res = await fetch("http://localhost:4001/players", {
		method: "POST",
		body: JSON.stringify({
			id,
			userName,
		}),
	});
	return res.json();
};

export const updatePlayer = async ({
	id,
	x,
	y,
}: { id: string; x: number; y: number }) => {
	const res = await fetch(`http://localhost:4001/players/${id}`, {
		method: "PATCH",
		body: JSON.stringify({
			x,
			y,
		}),
	});
	return res.json();
};
