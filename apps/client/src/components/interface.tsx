import { useCommands } from "../hooks/useCommands.ts";
import { usePlayers } from "../hooks/usePlayers.ts";
import { useTrees } from "../hooks/useTrees.ts";
import { useVillage } from "../hooks/useVillage.ts";

export const Interface = () => {
	const commands = useCommands();
	const players = usePlayers();
	const trees = useTrees();

	const showPlayers = players.map((player) => {
		const size = 100;
		const height = (size * 64) / 100;

		return (
			<div
				key={player.id}
				className="fixed"
				style={{ zIndex: player.y + height, top: player.y, left: player.x }}
			>
				<div style={{ marginTop: -height + 16, marginLeft: -height / 2 }}>
					<img
						src={"hero/hero_64.png"}
						alt=""
						className="w-fit"
						style={{ height: height }}
					/>
					<div className="mx-auto -mt-0 px-2 py-1 w-fit text-center bg-amber-100/90 text-amber-900 rounded-2xl font-semibold text-sm">
						{player?.userName}
					</div>
				</div>
			</div>
		);
	});

	const showLastCommands = commands?.map((command) => {
		const formattedDate = new Date(command.createdAt).toLocaleDateString(
			"ru-RU",
			{
				hour: "numeric",
				minute: "numeric",
			},
		);

		return (
			<div
				key={command.id}
				className="w-48 h-auto px-4 py-6 text-xl bg-amber-100/90 text-amber-900 border-b-4 rounded-2xl"
			>
				<p className="font-bold">{command.command}</p>
				<p>{command.player?.userName}</p>
				<p className="mt-2 text-sm">{formattedDate}</p>
			</div>
		);
	});

	const showTrees = trees?.map((tree) => {
		const size = tree.size;
		const height = (size * 128) / 100;

		const isShaking = tree.inProgress;

		return (
			<div
				key={tree.id}
				className={`fixed ${isShaking && "skew-x-shake"}`}
				style={{ zIndex: tree.y, top: tree.y, left: tree.x }}
			>
				<div style={{ marginTop: -height, marginLeft: -height / 2 }}>
					<img
						src={"tree/tree_128.png"}
						alt=""
						className="w-fit"
						style={{ height: height }}
					/>
				</div>
			</div>
		);
	});

	return (
		<div className="z-10 absolute top-0 left-0">
			{showPlayers}
			{showTrees}

			<Village />

			<div className="fixed bottom-4 left-4">
				<div className="mb-2 w-fit px-3 py-1 font-semibold text-xl text-amber-900 bg-amber-100/90 border-b-4 rounded-2xl">
					Последние действия:
				</div>
				<div className="flex flex-nowrap gap-2">{showLastCommands}</div>
			</div>
		</div>
	);
};

const Village = () => {
	const village = useVillage();

	const size = village?.wood ? village?.wood / 2 : 1;
	const height = (size * 128) / 100;

	const targetWidth =
		village?.globalTarget &&
		village?.globalTargetSuccess &&
		village.globalTarget / (village.globalTargetSuccess / 100);

	return (
		<>
			<div className="fixed top-4 left-4" style={{ zIndex: 1000 }}>
				<div className="w-64 h-auto px-4 py-4 text-xl text-amber-900 bg-amber-300/90 border-b-4 rounded-2xl">
					<p>Доступные команды:</p>
					<p className="font-bold text-2xl">!рубить</p>

					<p className="mt-4">В разработке:</p>
					<p className="font-bold text-2xl">!голос</p>
				</div>
			</div>

			<div className="fixed top-4 left-80 right-80" style={{ zIndex: 1000 }}>
				<div className="-z-10 relative w-full h-10 p-1.5 bg-amber-100/90 rounded-2xl border-b-4 border-amber-900/90">
					<div
						className="h-6 bg-amber-500 border-b-2 border-amber-700 rounded-2xl"
						style={{ width: `${targetWidth}%` }}
					/>
					<div className="absolute top-0.5 left-0 right-0 text-xl text-amber-900 font-bold">
						<div className="mx-auto text-center">
							{village?.globalTarget} / {village?.globalTargetSuccess}
						</div>
					</div>
				</div>

				<div className="w-fit h-auto mx-auto -mt-2 px-3 py-2 text-xl text-amber-900 bg-amber-300 border-b-4 rounded-2xl">
					<p className="font-semibold text-base">Фаза Альфа-1: Рубим деревья</p>
				</div>
			</div>

			<div className="fixed" style={{ top: 700, left: 700 }}>
				<div style={{ marginTop: -height, marginLeft: -height / 2 }}>
					<div className="ml-20 -mt-0 px-3 py-1 w-fit text-center bg-amber-100/90 text-amber-900 rounded-2xl font-bold text-sm">
						Строим деревню тут?
					</div>

					<img
						src={"dirt1_128.png"}
						alt=""
						className="w-fit"
						style={{ height: height }}
					/>

					<div className="mx-auto -mt-4 px-2 py-1 w-fit text-center text-amber-900 rounded-2xl text-sm">
						<div className="flex gap-2 justify-center">
							<div className="px-2 py-1 bg-amber-900/90 text-amber-100 border-b-4 border-amber-950 rounded-2xl">
								<p>Древесина</p>
								<p className="text-xl font-bold">{village?.wood}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
