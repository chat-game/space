import { create } from "zustand";
import type { IGameObjectStone } from "../../../../packages/api-sdk/src";

type StonesState = {
  objects: IGameObjectStone[];
  update: (obj: IGameObjectStone) => void;
};

export const useStonesStore = create<StonesState>((set) => ({
  objects: [],
  update: (obj) => {
    set((state) => {
      const findObj = state.objects.find((object) => obj.id === object.id);
      if (!findObj) {
        return {
          objects: [...state.objects, obj],
        };
      }

      return {
        objects: state.objects.map((object) => {
          if (object.id === obj.id) {
            return obj;
          }
          return object;
        }),
      };
    });
  },
}));
