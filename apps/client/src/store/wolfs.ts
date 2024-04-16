import { create } from "zustand";
import type { IGameObject } from "../../../../packages/api-sdk/src";

type WolfsState = {
  objects: IGameObject[];
  update: (obj: IGameObject) => void;
};

export const useWolfsStore = create<WolfsState>((set) => ({
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
