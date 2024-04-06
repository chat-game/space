import { useMemo } from "react";
import { PlayerBlock } from "../components/objects/player";
import { usePlayersStore } from "../store/players.ts";

export const PlayersLayer = () => {
  const players = usePlayersStore((state) => state.players);

  return (
    <>
      {useMemo(
        () =>
          players.map((player) => (
            <PlayerBlock key={player.id} object={player} />
          )),
        [players],
      )}
    </>
  );
};
