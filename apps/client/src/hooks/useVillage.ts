import { useEffect, useState } from "react";
import { type Village, getVillage } from "../../../../packages/api-sdk/src";

export const useVillage = () => {
  const [village, setVillage] = useState<Village>();

  useEffect(() => {
    getVillage().then((res) => {
      if (!res) return;

      setVillage(res);
    });

    const reload = setInterval(() => {
      getVillage().then((res) => {
        if (!res) return;

        setVillage(res);
      });
    }, 1000);

    return () => clearInterval(reload);
  }, []);

  return village;
};
