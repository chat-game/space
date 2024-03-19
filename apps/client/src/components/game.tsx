import { Sprite, Stage, TilingSprite } from "@pixi/react";
import { usePlayers } from "../hooks/usePlayers.ts";

export const Game = () => {
	const stageProps = {
		height: window.innerHeight,
		width: window.innerWidth,
		options: {
			backgroundAlpha: 0,
			antialias: false,
		},
	};

	const players = usePlayers();

	const showPlayers = players?.map((player: any) => {
		return (
			<Sprite
				key={player.id}
				image="hero/hero_64.png"
				x={player.x}
				y={player.y}
				anchor={{ x: 0.5, y: 0.5 }}
			/>
		);
	});

	return (
		<Stage {...stageProps}>
			<TilingSprite
				image={"Grass_Sample.png"}
				width={stageProps.width}
				height={stageProps.height}
				tilePosition={{ x: 100, y: 150 }}
			/>

			{showPlayers}

			<Sprite
				image="dirt1_128.png"
				x={700}
				y={700}
				anchor={{ x: 0.5, y: 0.5 }}
			/>

			<Sprite
				image="tree/tree_128.png"
				x={900}
				y={700}
				anchor={{ x: 0.5, y: 0.5 }}
				scale={0.8}
			/>
			<Sprite
				image="tree/tree_128.png"
				x={300}
				y={900}
				anchor={{ x: 0.5, y: 0.5 }}
				scale={0.5}
			/>
			<Sprite
				image="tree/tree_128.png"
				x={400}
				y={200}
				anchor={{ x: 0.5, y: 0.5 }}
				scale={1.2}
			/>
			<Sprite
				image="tree/tree_128.png"
				x={1000}
				y={300}
				anchor={{ x: 0.5, y: 0.5 }}
				scale={1.4}
			/>

			<Sprite image="wolf.png" x={1100} y={1000} anchor={{ x: 0.5, y: 0.5 }} />
		</Stage>
	);
};
