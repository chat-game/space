import { useEffect, useState } from "react";
import { getCommands } from "../lib/api.client.ts";

export const useCommands = () => {
	const [commands, setCommands] = useState([]);

	useEffect(() => {
		getCommands().then((res) => {
			setCommands(res);
		});

		const reload = setInterval(() => {
			getCommands().then((res) => {
				setCommands(res);
			});
		}, 5000);

		return () => clearInterval(reload);
	}, []);

	return commands;
};
