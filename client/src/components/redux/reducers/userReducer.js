import { createSlice } from "@reduxjs/toolkit";
import { userState } from "../States/userState";

const UserReducer = createSlice({
  name: "user",
  initialState: userState,
  reducers: {
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
  },
});

export const { setUserInfo } = UserReducer.actions;
export default UserReducer.reducer;
