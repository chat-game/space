import { useEffect, useState } from "react";
import { type Player, getPlayers } from "../../../../packages/api-sdk/src";

export const usePlayers = () => {
	const [players, setPlayers] = useState<Player[]>([]);

	useEffect(() => {
		getPlayers().then((res) => {
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
