import { configureStore } from "@reduxjs/toolkit";
import MenuReducer from "../reducers/MenuReducer";
import MouseReducer from "../reducers/MouseReducer";

export const store = configureStore({
  reducer: {
    menu: MenuReducer,
    mouse: MouseReducer,
  },
});
