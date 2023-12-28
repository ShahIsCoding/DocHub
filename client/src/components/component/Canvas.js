import React, { useEffect, useRef, useState } from "react";
import { WhiteboardMenu } from "../constants/WhiteboardOptions";
import { FaBars, FaPen } from "react-icons/fa";

const Canvas = (props) => {
  const canvasRef = useRef(null);
  const [context2D, setContext] = useState(null);
  const [icon, setIcon] = useState(<FaBars />);

  let { Drawing, selectedMenu } = props;
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    setContext(context);
  }, []);
  function getIcon(selection) {
    switch (selection) {
      case WhiteboardMenu.PEN:
        return setIcon(<FaPen />);

        break;

      default:
        setIcon(<FaBars />);
        break;
    }
  }
  return (
    <canvas
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseMove={(e) => {
        Drawing(e, context2D);
      }}
      style={{ cursor: "copy", border: "1px solid black" }}
      ref={canvasRef}
    ></canvas>
  );
};

export default Canvas;
