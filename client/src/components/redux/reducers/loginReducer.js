import { createSlice } from "@reduxjs/toolkit";
import { loginState } from "../States/loginState";

const loginReducer = createSlice({
  name: "login",
  initialStateL: loginState,
  reducers: {
    setCred(state, action) {
      state.username = action.payload.username;
      state.password = action.payload.password;
    },
  },
});
