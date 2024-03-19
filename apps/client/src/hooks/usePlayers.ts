import { useEffect, useState } from "react";
import { getPlayers } from "../lib/api.client.ts";

export const usePlayers = () => {
	const [players, setPlayers] = useState<any>([]);

	useEffect(() => {
		getPlayers().then((res) => {
			console.log(res);
			if (!res) return;

			setPlayers(res);
		});

		const reload = setInterval(() => {
			getPlayers().then((res) => {
				if (!res) return;

				setPlayers(res);
			});
		}, 1000);

		return () => clearInterval(reload);
	}, []);

	return players;
};
