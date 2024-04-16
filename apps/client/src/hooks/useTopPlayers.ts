import { useEffect, useState } from "react";
import {
  type TopPlayersResponse,
  getTopPlayers,
} from "../../../../packages/api-sdk/src";

export const useTopPlayers = () => {
  const [players, setPlayers] = useState<TopPlayersResponse>();

  useEffect(() => {
    getTopPlayers().then((res) => {
      if (!res) return;

      setPlayers(res);
    });

    const reload = setInterval(() => {
      getTopPlayers().then((res) => {
        if (!res) return;

        setPlayers(res);
      });
    }, 10000);

    return () => clearInterval(reload);
  }, []);

  return players;
};
