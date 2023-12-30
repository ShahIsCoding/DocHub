import { menuState } from "../States/menuState";
import { createSlice } from "@reduxjs/toolkit";
const MenuReducer = createSlice({
  name: "menu",
  initialState: menuState,
  reducers: {
    setColor(state, action) {
      state.color = action.payload;
    },
    setSize(state, action) {
      state.size = action.payload;
    },
    setSelectedMenu(state, action) {
      state.selectedMenu = action.payload;
    },
    setPrevSelectedMenu(state, action) {
      state.prevSelectedMenu = action.payload;
    },
  },
});

export const { setColor, setSize, setSelectedMenu, setPrevSelectedMenu } =
  MenuReducer.actions;
export default MenuReducer.reducer;
