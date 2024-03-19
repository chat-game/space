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
