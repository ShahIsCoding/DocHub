import { configureStore } from "@reduxjs/toolkit";
import MenuReducer from "../reducers/MenuReducer";
import LoginReducer from "../reducers/LoginReducer";

export const store = configureStore({
  reducer: {
    login: LoginReducer,
    menu: MenuReducer,
  },
});
