import { useCommands } from "../hooks/useCommands.ts";
import { usePlayers } from "../hooks/usePlayers.ts";

export const Interface = () => {
	const commands = useCommands();

	const players = usePlayers();

	const showPlayersInterfaces = players.map((player: any) => {
		return (
			<div
				key={player.id}
				className="absolute text-center px-2 py-1 bg-yellow-100/80 text-yellow-900 rounded-2xl font-bold text-sm"
				style={{ top: player.y + 32, left: player.x - 32 }}
			>
				{player?.userName}
			</div>
		);
	});

	const showLastCommands = commands.slice(0, 10).map((command: any) => {
		return (
			<div
				key={command.createdAt}
				className="w-auto h-auto px-4 py-6 text-xl bg-yellow-100/80 text-yellow-900 rounded-2xl"
			>
				<p className="font-bold">{command.command}</p>
				<p>{command.userName}</p>
			</div>
		);
	});

	return (
		<div className="z-10 absolute top-0 left-0">
			{showPlayersInterfaces}

			<div
				className="absolute text-center px-2 py-1 w-32 bg-yellow-100/80 text-yellow-900 rounded-2xl font-semibold text-sm"
				style={{ top: 620, left: 720 }}
			>
				Строим деревню тут?
			</div>

			<div className="fixed bottom-4 left-4">
				<div className="w-64 h-auto px-4 py-6 text-xl text-yellow-900 bg-yellow-100/80 rounded-2xl">
					<p>Доступные команды:</p>
					<p className="font-bold text-2xl">!рубить</p>
				</div>
			</div>

			<div className="fixed bottom-4 left-80">
				<div className="mb-2 font-semibold text-xl text-yellow-100">
					Последние действия:
				</div>
				<div className="flex gap-2">{showLastCommands}</div>
			</div>
		</div>
	);
};
