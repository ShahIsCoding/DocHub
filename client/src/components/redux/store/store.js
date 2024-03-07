import { configureStore } from "@reduxjs/toolkit";
import MenuReducer from "../reducers/MenuReducer";
import LoginReducer from "../reducers/LoginReducer";
import NotificationReducer from "../reducers/NotificationReducer";
export const store = configureStore({
  reducer: {
    login: LoginReducer,
    menu: MenuReducer,
    notificaiton: NotificationReducer,
  },
});
