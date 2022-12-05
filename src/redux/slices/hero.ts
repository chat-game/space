import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HeroState {
  x: number;
  y: number;
  speed: number;
  direction: "UP" | "DOWN" | "LEFT" | "RIGHT";
  isMoving: boolean;
  movingTo: {
    x: number;
    y: number;
  };
}

const initialState: HeroState = {
  x: 150,
  y: 150,
  speed: 1,
  direction: "DOWN",
  isMoving: false,
  movingTo: {
    x: 150,
    y: 150,
  },
};

export const heroSlice = createSlice({
  name: "hero",
  initialState,
  reducers: {
    setHeroPosition: (
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) => {
      state.x = action.payload.x;
      state.y = action.payload.y;
    },
    setHeroUp: (state) => {
      state.direction = "UP";
      state.y -= state.speed;
    },
    setHeroDown: (state) => {
      state.direction = "DOWN";
      state.y += state.speed;
    },
    setHeroLeft: (state) => {
      state.direction = "LEFT";
      state.x -= state.speed;
    },
    setHeroRight: (state) => {
      state.direction = "RIGHT";
      state.x += state.speed;
    },
    setHeroMovingTo: (
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) => {
      state.isMoving = true;
      state.movingTo.x = action.payload.x;
      state.movingTo.y = action.payload.y;
    },
  },
});

export const { setHeroPosition, setHeroMovingTo } = heroSlice.actions;

export default heroSlice.reducer;
