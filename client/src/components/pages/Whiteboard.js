import React, { useState } from "react";
import Canvas from "../component/Canvas";
import {
  WhiteboardMenu,
  WhiteboardOptions,
} from "../constants/WhiteboardOptions";
import { whiteBoardIcons } from "../assets/icons/icons";
import { handleDrag, handleInputChoice } from "../utils/CanvasUtils";

const Whiteboard = () => {
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(2);
  const [mouseData, setMouseData] = useState({ x: 0, y: 0 });
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [prevSelection, setPrevSelection] = useState(null);
  const { PEN, ERASE, COLOR } = WhiteboardMenu;
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

  const WhiteboardMenuDisplay = () => {
    return WhiteboardOptions.map((options) => {
      return (
        <div
          key={options.key}
          className="h-10 w-28 px-2 py-2 m-2 text-center rounded cursor-pointer bg-orange-300"
        >
          <div
            className="flex flex-row"
            // onClick={() => handleClick(options.key)}
          >
            <div className="">{options.Name}</div>
            <div className="ml-2">{whiteBoardIcons[options.Name]}</div>
            {handleInputChoice(options.key, color, setColor, size, setSize)}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-row">
      <div
        className=" h-20 border p-1 flex flex-row z-10 fixed"
        style={{ left: window.innerWidth / 2, top: 0 }}
        draggable
        onDragEnd={(e) => handleDrag()}
      >
        {WhiteboardMenuDisplay()}
      </div>
      <div className="w-screen h-screen">
        <Canvas Drawing={Drawing} selectedMenu={selectedMenu} />
      </div>
    </div>
  );
};

export default Whiteboard;
