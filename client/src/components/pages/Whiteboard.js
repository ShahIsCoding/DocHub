import React, { useEffect, useRef, useState } from "react";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  function randomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + randomColor;
  }
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(window.innerWidth / 2, window.innerHeight / 2);
    context.lineTo(mousePosition.x, mousePosition.y, 2, 2);
    context.strokeStyle = randomColor();
    context.stroke();
  }, [mousePosition]);
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.pageX,
        y: e.pageY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  });
  return (
    <canvas
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ background: "black" }}
      ref={canvasRef}
    ></canvas>
  );
};

export default Whiteboard;
