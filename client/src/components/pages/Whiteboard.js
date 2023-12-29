import React, { useState } from "react";
import Canvas from "../component/Canvas";
import {
  WhiteboardMenu,
  WhiteboardMenuConstants,
} from "../constants/WhiteboardOptions";
import { WhiteboardMenuDisplay } from "../utils/CanvasUtils";

const Whiteboard = () => {
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(2);
  const [mouseData, setMouseData] = useState({ x: 0, y: 0 });
  const [MenuPosition, setMenuPosition] = useState({
    x: window.innerWidth / 2,
    y: 0,
  });
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [prevSelection, setPrevSelection] = useState(null);
  const { PEN, ERASE, COLOR } = WhiteboardMenuConstants;

  const Drawing = (e, ctx) => {
    if (ctx === null) return;
    if (e.buttons !== 1) {
      setPrevSelection(null);
      return;
    }
    ctx.beginPath();
    if (prevSelection === PEN) ctx.moveTo(mouseData.x, mouseData.y);
    else ctx.moveTo(e.clientX, e.clientY);
    setMouseData({
      x: e.clientX,
      y: e.clientY,
    });
    ctx.lineTo(e.clientX, e.clientY);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.stroke();
    setPrevSelection(PEN);
  };
  const Erasing = (e, ctx) => {
    if (ctx === null) return;
    if (selectedMenu === ERASE) {
      ctx.beginPath();
      ctx.clearRect(e.clientX, e.clientY, e.clientX + size, e.clientY + size);
      setMouseData({
        x: e.clientX,
        y: e.clientY,
      });
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
    <div className="flex flex-row">
      <div
        className=" h-20 border p-1 flex flex-row items-center z-10 fixed"
        style={{ left: MenuPosition.x, top: MenuPosition.y }}
        draggable
        onDragEnd={(e) => {
          setMenuPosition({
            x: e.clientX,
            y: e.clientY,
          });
        }}
      >
        {WhiteboardMenuDisplay(
          color,
          setColor,
          size,
          setSize,
          selectedMenu,
          setSelectedMenu
        )}
      </div>
      <div className="w-screen h-screen">
        <Canvas actionCallback={(e, ctx) => getActionCallback(e, ctx)} />
      </div>
    </div>
  );
};

export default Whiteboard;
