import { create } from "zustand";
import type { GameObjectPlayer } from "../../../../packages/api-sdk/src";

type PlayersState = {
  players: GameObjectPlayer[];
  update: (obj: GameObjectPlayer) => void;
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
