import React, { useEffect, useRef } from "react";

const Canvas = (props) => {
  const canvasRef = useRef(null);

  let { actionCallback, canvas, setCanvas } = props;
  useEffect(() => {
    const canvas = canvasRef.current;
    setCanvas(canvas);
  }, []);
  console.log(
    canvasRef?.current?.getBoundingClientRect(),
    canvasRef?.current?.offsetTop
  );
  return (
    <canvas
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseMove={(e) => {
        actionCallback(e, {}, false);
      }}
      style={{ cursor: "copy", border: "1px solid black" }}
      ref={canvasRef}
    ></canvas>
  );
};

export default Canvas;
