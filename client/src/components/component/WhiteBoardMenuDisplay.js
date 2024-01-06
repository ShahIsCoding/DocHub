import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedMenu,
  setSize,
  setColor,
} from "../redux/reducers/MenuReducer";
import { WhiteboardMenuConstants } from "../constants/WhiteboardOptions";

const WhiteBoardMenuDisplay = ({ Menu }) => {
  const menuState = useSelector((state) => state.menu);
  const { PEN, COLOR } = WhiteboardMenuConstants;
  const { color, size, selectedMenu } = menuState;
  const dispatch = useDispatch();
  const handleInputChoice = (key) => {
    switch (key) {
      case 1:
        return (
          <input
            type="color"
            className="input-color w-2/5"
            value={color}
            onChange={(e) => dispatch(setColor(e.target.value))}
          />
        );
      case 2:
        return (
          <input
            type="number"
            className="w-4/5"
            min={1}
            max={50}
            value={size}
            onChange={(e) => dispatch(setSize(e.target.value))}
          />
        );
      default:
        break;
    }
  };
  const MenuItems = (Menu) => {
    return Menu.map((item, index) => {
      return (
        <>
          <div
            key={item.key}
            className={`h-10 w-28 px-2 py-2 m-2 text-center rounded cursor-pointer ${
              selectedMenu === item.Name ? "bg-orange-300" : "bg-blue-300"
            }`}
          >
            <div
              className="flex flex-row"
              onClick={(e) =>
                dispatch(setSelectedMenu(item.Name === COLOR ? PEN : item.Name))
              }
            >
              <div className="">{item.Name}</div>
              <div className="ml-2">{item.icon}</div>
              {handleInputChoice(item.key)}
            </div>
          </div>
          {item.child &&
            selectedMenu === item.Name &&
            MenuItems(item.childOptions)}
        </>
      );
    });
  };
  return <div className="flex flex-row items-center">{MenuItems(Menu)}</div>;
};

export default WhiteBoardMenuDisplay;
