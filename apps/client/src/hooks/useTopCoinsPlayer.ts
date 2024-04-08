import { useEffect, useState } from "react";
import {
  type Player,
  getTopByCoinsPlayers,
} from "../../../../packages/api-sdk/src";

export const useTopCoinsPlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    getTopByCoinsPlayers().then((res) => {
      if (!res) return;

      setPlayers(res);
    });

    const reload = setInterval(() => {
      getTopByCoinsPlayers().then((res) => {
        if (!res) return;

        setPlayers(res);
      });
    }, 10000);

    return () => clearInterval(reload);
  }, []);

  return players;
};
