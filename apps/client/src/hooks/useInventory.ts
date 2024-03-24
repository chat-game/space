import { useEffect, useState } from "react";
import {
  type InventoryItem,
  getPlayerInventory,
} from "../../../../packages/api-sdk/src";

export const useInventory = (playerId: string) => {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    getPlayerInventory(playerId).then((res) => {
      if (!res) return;

      setItems(res);
    });

    const reload = setInterval(() => {
      getPlayerInventory(playerId).then((res) => {
        if (!res) return;

        setItems(res);
      });
    }, 1000);

    return () => clearInterval(reload);
  }, [playerId]);

  return items;
};
