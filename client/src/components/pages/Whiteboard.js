import React from "react";
import Canvas from "../component/Canvas";
import { WhiteboardOptions } from "../constants/WhiteboardOptions";
import { whiteBoardIcons } from "../assets/icons/icons";
import { MdRowing } from "react-icons/md";

const Whiteboard = () => {
  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
    ctx.fill();
  };

  return (
    <div className="flex flex-row">
      <div className="w-28 h-screen border p-1">
        {WhiteboardOptions.map((options) => {
          return (
            <div
              key={options.key}
              className="h-10 px-2 py-2 text-center bg-slate-400 rounded cursor-pointer"
            >
              <div className="flex flex-row w-full h-full items-center justify-center">
                <div className="">{options.Name}</div>
                <div className="ml-2">{whiteBoardIcons[options.Name]}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-4/5 h-screen">
        <Canvas draw={draw} />
      </div>
    </div>
  );
};

export default Whiteboard;
