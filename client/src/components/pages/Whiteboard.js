import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Canvas from "../component/Canvas";
import {
  WhiteboardMenuConstants,
  WhiteboardOptionsConstants,
} from "../constants/WhiteboardOptions";
import WhiteBoardMenuDisplay from "../component/WhiteBoardMenuDisplay";
import { useParams } from "react-router-dom";
import rough from "roughjs";
import {
  configureElement,
  getSelectedELementId,
  updateElement,
} from "../utils/whiteboardUtils";

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
  const [selectedElementId, setSelectElementId] = useState(null);

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
      console.log(elements);
      elements?.map(({ path }, idx) => {
        roughContext.draw(path);
      });
    }
  }, [elements, drawing]);

  useEffect(() => {
    if (socket == null) return;
    socket.once("load-document", (document) => {});
    socket.emit("get-document", documentId);
  }, [socket, documentId]);

  const handleReceivedChanges = (socket) => {
    socket.on("wb-receive-changes", (data) => {
      let { process, element } = data;
      setElements((prevElements) => {
        let elementsCopy = [...prevElements];
        let index = elementsCopy.findIndex(({ id }) => id === element.id);
        if (index === -1) {
          return [...prevElements, element];
        } else {
          elementsCopy[index] = element;
          return elementsCopy;
        }
      });
    });
  };

  useEffect(() => {
    handleReceivedChanges(socket);
  }, [socket]);
  const sendChanges = (element, process) => {
    let data = {
      element,
      process,
    };
    socket.emit("whiteboardChanges", data);
  };
  const getAttributes = (e) => {
    let { clientX: positionX, clientY: positionY } = e;
    let { top, left } = canvas.getBoundingClientRect();
    let attributes = {
      color,
      size,
      currX: positionX - left,
      currY: positionY - top,
      prevX: positionX - left,
      prevY: positionY - top,
    };
    return attributes;
  };
  const handleMouseMove = (e) => {
    if (!drawing) return;
    let attributes = getAttributes(e);
    if (selectedMenu !== null) {
      let index = elements.length - 1;
      if (selectedMenu === WhiteboardMenuConstants.ERASE) {
        let elementsCopy = [...elements];
        elementsCopy = elementsCopy.filter(({ id }, idx) => {
          return id !== selectedElementId;
        });
        setElements(elementsCopy);
      } else {
        if (selectedMenu === WhiteboardMenuConstants.MOVE) {
          index = selectedElementId;
        }
        let prevElement = elements[index];
        let updatedElement = updateElement(
          prevElement,
          attributes,
          generator,
          selectedMenu
        );
        let elementsCopy = [...elements];
        elementsCopy[index] = updatedElement;
        sendChanges(updatedElement, "update");
        setElements(elementsCopy);
      }
    }
  };

  const handleMouseDown = (event) => {
    setDrawing(true);
    let attributes = getAttributes(event);
    if (selectedMenu !== null) {
      if (
        selectedMenu === WhiteboardMenuConstants.MOVE ||
        selectedMenu === WhiteboardMenuConstants.ERASE
      ) {
        let { top, left } = canvas.getBoundingClientRect();
        let id = getSelectedELementId(
          { x: event.clientX - left, y: event.clientY - top },
          elements
        );
        setSelectElementId(id);
      } else {
        let id = elements.length;
        let element = configureElement(id, attributes, generator, selectedMenu);
        sendChanges(element, "add");
        setElements((prev) => [...prev, element]);
      }
    }
  };
  const handleMouseUp = (event) => {
    setDrawing(false);
    setSelectElementId(null);
    let elementsCopy = [...elements];
    elementsCopy = elementsCopy.filter(({ attributes }, index) => {
      let { currX, currY, prevX, prevY, color } = attributes;
      return !(currX === prevX && currY === prevY);
    });
    setElements(elementsCopy);
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
