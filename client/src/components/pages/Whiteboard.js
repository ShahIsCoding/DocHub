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

  // created paths
  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (canvas === null) return;
    setContext(canvas.getContext("2d"));
    setRoughContext(rough.canvas(canvas));
    setGenerator(rough.canvas(canvas).generator);
  }, [canvas]);

  useEffect(() => {
    if (!context) return;
    if (elements !== undefined && elements.length > 0) {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      elements?.map(({ path }, idx) => {
        roughContext.draw(path);
      });
    }
  }, [elements, drawing]);

  const getAttributes = (e) => {
    let { clientX: positionX, clientY: positionY } = e;
    let { top, left } = canvas.getBoundingClientRect();
    let attributes = {
      selectedMenu,
      color,
      size,
      newPosX: positionX - left,
      newPosY: positionY - top,
      currPosX: positionX - left,
      currPosY: positionY - top,
    };
    return attributes;
  };
  const handleMouseMove = (e) => {
    if (!drawing) return;

    let attributes = getAttributes(e);

    if (selectedMenu !== null) {
      const index = elements.length - 1;
      const currElement = elements[index];
      let { attributes: prevAttribute } = currElement;
      attributes.currPosX = prevAttribute.currPosX;
      attributes.currPosY = prevAttribute.currPosY;
      let element = createElement(attributes, generator);
      let elementsCopy = [...elements];
      elementsCopy[index] = element;
      setElements(elementsCopy);
    }
  };
  const handleMouseDown = (event) => {
    setDrawing(true);
    let attributes = getAttributes(event);
    if (selectedMenu !== null) {
      let element = createElement(attributes, generator);
      setElements((prev) => [...prev, element]);
    }
  };
  const handleMouseUp = (event) => {
    setDrawing(false);
  };
  return (
    <div className="flex flex-col">
      <div className=" border p-1 " style={{ left: 0, top: 0 }}>
        <WhiteBoardMenuDisplay Menu={WhiteboardOptionsConstants} />
      </div>
      <div className="w-full h-full">
        <Canvas
          hanldeMouseMove={handleMouseMove}
          handleMouseDown={handleMouseDown}
          hanldeMouseUp={handleMouseUp}
          canvas={canvas}
          setCanvas={setCanvas}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
