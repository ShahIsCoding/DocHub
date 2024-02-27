import { createSlice } from "@reduxjs/toolkit";
import { loginState } from "../States/loginState";
import { TOKEN, apiConstants, apiToken } from "../../constants/apiConstants";

const LoginReducer = createSlice({
  name: "login",
  initialState: loginState,
  reducers: {
    setToken(state, action) {
      apiConstants.TOKEN = action.payload;
      state.token = action.payload;
    },
  },
});

export const { setToken } = LoginReducer.actions;
export default LoginReducer.reducer;
