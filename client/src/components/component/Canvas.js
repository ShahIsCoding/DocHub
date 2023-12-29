import React, { useEffect, useRef, useState } from "react";

const Canvas = (props) => {
  const canvasRef = useRef(null);
  const [context2D, setContext] = useState(null);

  let { actionCallback } = props;
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    setContext(context);
  }, []);

  return (
    <canvas
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseMove={(e) => {
        actionCallback(e, context2D);
      }}
      style={{ cursor: "copy", border: "1px solid black" }}
      ref={canvasRef}
    ></canvas>
  );
};

export default Canvas;
