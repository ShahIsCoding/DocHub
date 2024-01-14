import React, { useEffect, useRef } from "react";

const Canvas = ({
  hanldeMouseMove,
  hanldeMouseUp,
  handleMouseDown,
  setCanvas,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    setCanvas(canvas);
  }, []);

  return (
    <canvas
      style={{ background: "black" }}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseUp={hanldeMouseUp}
      onMouseDown={handleMouseDown}
      onMouseMove={hanldeMouseMove}
      ref={canvasRef}
    ></canvas>
  );
};

export default Canvas;
