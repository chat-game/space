import { create } from "zustand";
import type { GameObjectTree } from "../../../../packages/api-sdk/src";

type TreesState = {
  objects: GameObjectTree[];
  update: (obj: GameObjectTree) => void;
};

export const useTreesStore = create<TreesState>((set) => ({
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
