import { useEffect, useState } from "react";
import {
  type Player,
  getTopByReputationPlayers,
} from "../../../../packages/api-sdk/src";

export const useTopPlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    getTopByReputationPlayers().then((res) => {
      if (!res) return;

      setPlayers(res);
    });

    const reload = setInterval(() => {
      getTopByReputationPlayers().then((res) => {
        if (!res) return;

        setPlayers(res);
      });
    }, 10000);

    return () => clearInterval(reload);
  }, []);

  return players;
};
