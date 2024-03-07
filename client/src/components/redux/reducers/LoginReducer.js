import { createSlice } from "@reduxjs/toolkit";
import { loginState } from "../States/loginState";
import { constants } from "../../constants/apiConstants";

const LoginReducer = createSlice({
  name: "login",
  initialState: loginState,
  reducers: {
    setToken(state, action) {
      constants.TOKEN = action.payload;
      state.token = action.payload;
    },
    setUserId(state, action) {
      constants._id = action.payload;
      state._id = action.payload;
    },
  },
});

export const { setToken, setUserId } = LoginReducer.actions;
export default LoginReducer.reducer;
