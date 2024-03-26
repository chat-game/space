import { useEffect, useState } from "react";
import { type Stone, getStones } from "../../../../packages/api-sdk/src";

export const useStones = () => {
  const [stones, setStones] = useState<Stone[]>([]);

  useEffect(() => {
    getStones().then((res) => {
      if (!res) return;

      setStones(res);
    });

    const reload = setInterval(() => {
      getStones().then((res) => {
        if (!res) return;

        setStones(res);
      });
    }, 1000);

    return () => clearInterval(reload);
  }, []);

  return stones;
};
