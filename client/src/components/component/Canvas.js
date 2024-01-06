import React, { useEffect, useRef } from "react";

const Canvas = (props) => {
  const canvasRef = useRef(null);

  let { mouseMove, setCanvas } = props;
  useEffect(() => {
    const canvas = canvasRef.current;
    setCanvas(canvas);
  }, []);

  return (
    <canvas
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseMove={mouseMove}
      style={{ cursor: "copy", border: "1px solid black" }}
      ref={canvasRef}
    ></canvas>
  );
};

export default Canvas;
