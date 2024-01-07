import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Canvas from "../component/Canvas";
import { WhiteboardOptionsConstants } from "../constants/WhiteboardOptions";
import WhiteBoardMenuDisplay from "../component/WhiteBoardMenuDisplay";
import { useParams } from "react-router-dom";
import rough from "roughjs";
import { createElement } from "../utils/whiteboardUtils";

const Whiteboard = ({ socket }) => {
  const menu = useSelector((state) => state.menu);
  const { color, size, selectedMenu } = menu;

  const { id: documentId } = useParams();
  // canvas and context
  const [canvas, setCanvas] = useState(null);
  const [context, setContext] = useState(null);
  const [roughContext, setRoughContext] = useState(null);
  const [generator, setGenerator] = useState(null);
  //  Positions
  let [currPos, setCurrPos] = useState({ x: null, y: null });
  let [startPos, setStartPos] = useState({ x: null, y: null });
  // created paths
  const [elements, setElements] = useState([]);
  let [currElement, setCurrElement] = useState(null);

  useEffect(() => {
    if (canvas === null) return;
    setContext(canvas.getContext("2d"));
    setRoughContext(rough.canvas(canvas));
    setGenerator(rough.canvas(canvas).generator);
  }, [canvas]);

  useEffect(() => {
    if (!context) return;
    if (elements !== undefined && elements.length > 0) {
      elements?.map((element, idx) => {
        console.log(element, idx);
        roughContext.draw(element);
      });
    }
  }, [elements]);

  const mouseMove = (e) => {
    let { buttons, clientX: positionX, clientY: positionY } = e;
    let { top, left } = canvas.getBoundingClientRect();
    let attributes = {
      selectedMenu,
      color,
      size,
      newPosX: positionX - left,
      newPosY: positionY - top,
      currPosX: currPos.x - left,
      currPosY: currPos.y - top,
      startPosX: startPos.x === null ? positionX - left : startPos.x,
      startPosY: startPos.y === null ? positionY - top : startPos.y,
    };
    setCurrPos({ x: e.clientX, y: e.clientY });
    if (selectedMenu !== null && buttons === 1) {
      startPos.x === null &&
        setStartPos({ x: positionX - left, y: positionY - top });
      // console.log(attributes);
      currElement = createElement(attributes, context, generator, roughContext);
      setCurrElement(currElement);
    }
    if (selectedMenu !== null && currElement !== null && buttons === 0) {
      setElements((prev) => [...prev, currElement]);
      setCurrElement(null);
      setStartPos({ x: null, y: null });
    }
  };
  return (
    <div className="flex flex-col">
      <div className=" border p-1 " style={{ left: 0, top: 0 }}>
        <WhiteBoardMenuDisplay Menu={WhiteboardOptionsConstants} />
      </div>
      <div className="w-full h-full">
        <Canvas mouseMove={mouseMove} canvas={canvas} setCanvas={setCanvas} />
      </div>
    </div>
  );
};

export default Whiteboard;
