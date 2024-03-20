import { Sprite, Stage, TilingSprite } from "@pixi/react";

export const Game = () => {
	const stageProps = {
		height: window.innerHeight,
		width: window.innerWidth,
		options: {
			backgroundAlpha: 0,
			antialias: false,
		},
	};

	return (
		<Stage {...stageProps}>
			<TilingSprite
				image={"Grass_Sample.png"}
				width={stageProps.width}
				height={stageProps.height}
				tilePosition={{ x: 100, y: 150 }}
			/>

			<Sprite image="wolf.png" x={1100} y={1000} anchor={{ x: 0.5, y: 0.5 }} />
		</Stage>
	);
};
