export async function getCommands() {
	const res = await fetch("http://localhost:4001/commands");
	return res.json();
}

export async function getPlayers() {
	try {
		const res = await fetch("http://localhost:4001/players");
		return res.json();
	} catch (err) {
		return null;
	}
}
