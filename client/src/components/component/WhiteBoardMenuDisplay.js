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
  const { PEN, COLOR, SIZE } = WhiteboardMenuConstants;
  const { color, size, selectedMenu } = menuState;
  const dispatch = useDispatch();
  const handleInputChoice = (key) => {
    switch (key) {
      case COLOR:
        return (
          <input
            type="color"
            className="input-color"
            value={color}
            onChange={(e) => dispatch(setColor(e.target.value))}
          />
        );
      case SIZE:
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
          {item.child ? (
            <div className="border flex flex-col mx-2 rounded">
              <div className="flex flex-row ">
                {MenuItems(item.childOptions)}
              </div>
              <h6 className="w-full bg-slate-300 text-center">{item.Name}</h6>
            </div>
          ) : (
            <div
              key={item.key}
              className={`h-10 p-2 m-2 text-center rounded cursor-pointer ${
                selectedMenu === item.Name ? "bg-orange-300" : "bg-blue-300"
              }`}
            >
              <div
                className="flex flex-row my-auto items-center"
                onClick={(e) =>
                  dispatch(
                    setSelectedMenu(item.Name === COLOR ? PEN : item.Name)
                  )
                }
              >
                <div className="">{item.Name}</div>
                <div className="mx-3">{item.icon}</div>
                {handleInputChoice(item.Name)}
              </div>
            </div>
          )}
        </>
      );
    });
  };
  return <div className="flex flex-row items-center">{MenuItems(Menu)}</div>;
};

export default WhiteBoardMenuDisplay;
