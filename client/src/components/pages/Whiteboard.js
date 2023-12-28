import React, { useState } from "react";
import Canvas from "../component/Canvas";
import { WhiteboardOptions } from "../constants/WhiteboardOptions";
import { whiteBoardIcons } from "../assets/icons/icons";

const Whiteboard = () => {
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(10);
  const [mouseData, setMouseData] = useState({ x: 0, y: 0 });

  const setPosition = (e) => {
    setMouseData({
      x: e.clientX,
      y: e.clientY,
    });
  };
  const Drawing = (e, ctx) => {
    console.log({ e, ctx });
    if (e.buttons !== 1 || ctx === null) return;
    else console.log("FALSE");
    ctx.beginPath();
    ctx.moveTo(mouseData.x, mouseData.y);
    setMouseData({
      x: e.clientX,
      y: e.clientY,
    });
    ctx.lineTo(e.clientX, e.clientY);
    ctx.strokeStyle = color;
    // ctx.lineWidth = size;
    // ctx.lineCap = "round";
    ctx.stroke();
  };

  return (
    <div className="flex flex-row">
      <div className="w-28 h-screen border p-1">
        {WhiteboardOptions.map((options) => {
          return (
            <div
              key={options.key}
              className="h-10 px-2 py-2 m-2 text-center rounded cursor-pointer bg-orange-300"
            >
              <div className="flex flex-row w-full h-full items-center justify-center">
                <div className="">{options.Name}</div>
                <div className="ml-2">{whiteBoardIcons[options.Name]}</div>
                {options.key === 1 ? (
                  <input
                    type="color"
                    className="input-color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-4/5 h-screen">
        <Canvas Drawing={Drawing} setPosition={setPosition} />
      </div>
    </div>
  );
};

export default Whiteboard;
