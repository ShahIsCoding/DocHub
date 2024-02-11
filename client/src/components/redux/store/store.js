import { configureStore } from "@reduxjs/toolkit";
import MenuReducer from "../reducers/MenuReducer";
import LoginReducer from "../reducers/userReducer";

export const store = configureStore({
  reducer: {
    user: LoginReducer,
    menu: MenuReducer,
  },
});
