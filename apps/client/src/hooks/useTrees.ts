import { useEffect, useState } from "react";
import { type Tree, getTrees } from "../../../../packages/api-sdk/src";

export const useTrees = () => {
	const [trees, setTrees] = useState<Tree[]>([]);

	useEffect(() => {
		getTrees().then((res) => {
			if (!res) return;

			setTrees(res);
		});

		const reload = setInterval(() => {
			getTrees().then((res) => {
				if (!res) return;

				setTrees(res);
			});
		}, 1000);

		return () => clearInterval(reload);
	}, []);

	return trees;
};
