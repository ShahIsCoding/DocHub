import React, { useEffect, useRef } from "react";

const Canvas = ({ draw }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let frameCount = 0;
    let animationFrameId;
    const render = () => {
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);
  return (
    <canvas
      width={window.innerWidth}
      height={window.innerHeight}
      // style={{ background: "black" }}
      ref={canvasRef}
    ></canvas>
  );
};

export default Canvas;
