import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  small: [
    {
      id: 1,
      x: 250,
      y: 200,
      type: "WOLF",
      speed: 0.03,
      direction: "down",
      moving: true,
      movingTo: {
        x: 260,
        y: 250,
      },
    },
    {
      id: 2,
      x: 550,
      y: 500,
      type: "WOLF",
      speed: 0.03,
      direction: "down",
      moving: true,
      movingTo: {
        x: 560,
        y: 500,
      },
    },
    {
      id: 3,
      x: 350,
      y: 700,
      type: "WOLF",
      speed: 0.03,
      direction: "down",
      moving: true,
      movingTo: {
        x: 360,
        y: 700,
      },
    },
  ],
};

export const creaturesSlice = createSlice({
  name: "creatures",
  initialState,
  reducers: {
    setCreatureMovingTo: (
      state,
      action: PayloadAction<{ id: number; x: number; y: number }>
    ) => {
      const creature = state.small.find((c) => c.id === action.payload.id);
      if (!creature) return;

      creature.moving = true;
      creature.movingTo.x = action.payload.x;
      creature.movingTo.y = action.payload.y;
    },
    setCreatureMoving: (
      state,
      action: PayloadAction<{ id: number; isMoving: boolean }>
    ) => {
      const creature = state.small.find((c) => c.id === action.payload.id);
      if (!creature) return;

      creature.moving = action.payload.isMoving;
    },
    setCreaturePosition: (
      state,
      action: PayloadAction<{
        id: number;
        x: number;
        y: number;
      }>
    ) => {
      const creature = state.small.find((c) => c.id === action.payload.id);
      if (!creature) return;

      creature.x = action.payload.x;
      creature.y = action.payload.y;
    },
  },
});

export const { setCreatureMovingTo, setCreatureMoving, setCreaturePosition } =
  creaturesSlice.actions;

export default creaturesSlice.reducer;
