import { create } from "zustand";
import type { IGameObjectPlayer } from "../../../../packages/api-sdk/src";

type PlayersState = {
  players: IGameObjectPlayer[];
  update: (obj: IGameObjectPlayer) => void;
};

export const usePlayersStore = create<PlayersState>((set) => ({
  players: [],
  update: (obj) => {
    set((state) => {
      const findObj = state.players.find((object) => obj.id === object.id);
      if (!findObj) {
        return {
          players: [...state.players, obj],
        };
      }

      return {
        players: state.players.map((object) => {
          if (object.id === obj.id) {
            return obj;
          }
          return object;
        }),
      };
    });
  },
}));
