import { createSlice } from "@reduxjs/toolkit";
import { initialMouseState } from "../States/mouseState";

const MouseReducer = createSlice({
  name: "mouse",
  initialState: initialMouseState,
  reducers: {
    setPosition(state, action) {
      state = { ...state, ...action.payload };
    },
  },
});

export const { setPosition } = MouseReducer.actions;
export default MouseReducer.reducer;
