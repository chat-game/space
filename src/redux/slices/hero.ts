import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  x: 150,
  y: 150,
  speed: 1,
  direction: "down",
  moving: {
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
      state.direction = "up";
      state.y -= state.speed;
    },
    setHeroDown: (state) => {
      state.direction = "down";
      state.y += state.speed;
    },
    setHeroLeft: (state) => {
      state.direction = "left";
      state.x -= state.speed;
    },
    setHeroRight: (state) => {
      state.direction = "right";
      state.x += state.speed;
    },
    setHeroDirection: (state, action: PayloadAction<string>) => {
      state.direction = action.payload;
    },
    setHeroMoving: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.moving.x = action.payload.x;
      state.moving.y = action.payload.y;
    },
  },
});

export const {
  setHeroUp,
  setHeroDown,
  setHeroLeft,
  setHeroRight,
  setHeroMoving,
} = heroSlice.actions;

export default heroSlice.reducer;
