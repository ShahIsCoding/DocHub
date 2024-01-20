import { createSlice } from "@reduxjs/toolkit";
import { loginState } from "../States/loginState";

const LoginReducer = createSlice({
  name: "login",
  initialState: loginState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});

export const { setToken } = LoginReducer.actions;
export default LoginReducer.reducer;
