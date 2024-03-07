import { createSlice } from "@reduxjs/toolkit";
import { NotificationState } from "../States/notificationState";

const NotificationReducer = createSlice({
  name: "notification",
  initialState: NotificationState,
  reducers: {
    setNotification(state, { type, payload }) {
      state.message = payload.message;
      state.statusCode = payload.statusCode;
      state.visible = true;
    },
    setNotificaitonVisible(state, payload) {
      state.visible = payload.visible;
    },
  },
});

export const { setNotification, setNotificaitonVisible } =
  NotificationReducer.actions;
export default NotificationReducer.reducer;
