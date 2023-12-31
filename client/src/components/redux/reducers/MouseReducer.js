import { createSlice } from "@reduxjs/toolkit";
import { initialMouseState } from "../States/mouseState";

const MouseReducer = createSlice({
  name: "mouse",
  initialState: initialMouseState,
  reducers: {
    setPosition(state, action) {
      state.posX = action.payload.x;
      state.posY = action.payload.y;
    },
    setPosX(state, action) {
      state = { ...state, posX: action.payload };
    },
    setPosY(state, action) {
      state = { ...state, posY: action.payload };
    },
  },
});

export const { setPosition, setPosX, setPosY } = MouseReducer.actions;
export default MouseReducer.reducer;
