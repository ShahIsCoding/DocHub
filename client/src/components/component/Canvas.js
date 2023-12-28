import React, { useEffect, useRef, useState } from "react";

const Canvas = ({ Drawing, setPosition }) => {
  const canvasRef = useRef(null);
  const [context2D, setContext] = useState(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    setContext(context);
  }, []);
  return (
    <canvas
      width={window.innerWidth}
      height={window.innerHeight}
      // onMouseDown={(e) => setPosition(e)}
      onMouseMove={(e) => {
        setPosition(e);
        Drawing(e, context2D);
      }}
      // onMouseEnter={(e) => setPosition(e)}
      // style={{ background: "black" }}
      ref={canvasRef}
    ></canvas>
  );
};

export default Canvas;
