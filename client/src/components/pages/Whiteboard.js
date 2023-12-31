import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Canvas from "../component/Canvas";
import {
  WhiteboardMenuConstants,
  WhiteboardOptionsConstants,
} from "../constants/WhiteboardOptions";
import { setPrevSelectedMenu } from "../redux/reducers/MenuReducer";
import { setPosition } from "../redux/reducers/MouseReducer";
import WhiteBoardMenuDisplay from "../component/WhiteBoardMenuDisplay";

const Whiteboard = ({ socket }) => {
  const { PEN, ERASE } = WhiteboardMenuConstants;
  const mouse = useSelector((state) => state.mouse);
  const menu = useSelector((state) => state.menu);
  const { color, size, selectedMenu, prevSelectedMenu } = menu;
  const dispatch = useDispatch();
  const Drawing = (e, ctx) => {
    if (ctx === null) return;
    if (e.buttons !== 1) {
      dispatch(setPrevSelectedMenu(null));
      return;
    }
    ctx.beginPath();
    if (prevSelectedMenu === PEN) {
      ctx.moveTo(mouse.posX, mouse.posY);
    } else ctx.moveTo(e.clientX, e.clientY);
    dispatch(
      setPosition({
        x: e.clientX,
        y: e.clientY,
      })
    );
    ctx.lineTo(e.clientX, e.clientY);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.stroke();
    dispatch(setPrevSelectedMenu(PEN));
  };
  const Erasing = (e, ctx) => {
    if (ctx === null) return;
    if (selectedMenu === ERASE) {
      ctx.beginPath();
      ctx.clearRect(e.clientX, e.clientY, e.clientX + size, e.clientY + size);
      dispatch(
        setPosition({
          x: e.clientX,
          y: e.clientY,
        })
      );
    }
  };
  const getActionCallback = (e, ctx) => {
    switch (selectedMenu) {
      case PEN:
        Drawing(e, ctx);
        break;
      case ERASE:
        Erasing(e, ctx);
        break;
      default:
        break;
    }
  };
  return (
    <div className="flex flex-col">
      <div className=" border p-1 " style={{ left: 0, top: 0 }}>
        <WhiteBoardMenuDisplay Menu={WhiteboardOptionsConstants} />
      </div>
      <div className="w-full h-full">
        <Canvas actionCallback={(e, ctx) => getActionCallback(e, ctx)} />
      </div>
    </div>
  );
};

export default Whiteboard;
