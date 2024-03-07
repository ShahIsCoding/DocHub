import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  getMouseCursor,
  getSelectedELement,
  updateElement,
} from "../utils/whiteboardUtils";
import { useHistory } from "../hooks/useHistory";
import { setSelectedMenu } from "../redux/reducers/MenuReducer";
import { documentApi } from "../service/api";
import { constants } from "../constants/apiConstants";

const Whiteboard = ({ socket }) => {
  const menu = useSelector((state) => state.menu);
  const { color, size, selectedMenu } = menu;
  const dispatch = useDispatch();

  const { id: documentId } = useParams();
  // canvas and context
  const [canvas, setCanvas] = useState(null);
  const [context, setContext] = useState(null);
  const [roughContext, setRoughContext] = useState(null);
  const [generator, setGenerator] = useState(null);

  // created paths
  const [elements, setElements, undo, redo] = useHistory([]);
  const [drawing, setDrawing] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const { id: params } = useParams();

  useEffect(() => {
    if (canvas === null) return;
    setContext(canvas.getContext("2d"));
    setRoughContext(rough.canvas(canvas));
    setGenerator(rough.canvas(canvas).generator);
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [canvas, socket]);

  useEffect(() => {
    socket.emit("get-document", documentId);
    socket.on("receive-changes-wb", (data) => {
      console.log(data);
    });
  }, [socket]);
  useEffect(() => {
    documentApi.getDocument(params.split(":")[1], (resp) =>
      setElements(resp.document.data, true)
    );
  }, []);

  useEffect(() => {
    documentApi.getDocument(
      params.split(":")[1],
      (resp) => setElements(resp.document.data, true),
      (err) => console.error(err)
    );
  }, []);

  useEffect(() => {
    if (!context) return;
    if (elements !== undefined && elements.length > 0) {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      selectedElement !== null &&
        selectedMenu === WhiteboardMenuConstants.MOVE &&
        roughContext.draw(selectedElement.path);
      elements?.forEach(({ path }, idx) => {
        roughContext.draw(path);
      });
      let payload = {
        elements: elements,
        uuid: constants._id,
      };
      socket.emit("send-changes-wb", payload);
    }
  }, [elements, drawing]);

  useEffect(() => {
    if (selectedMenu !== WhiteboardMenuConstants.MOVE) {
      setSelectedElement(null);
    }
    switch (selectedMenu) {
      case WhiteboardMenuConstants.REDO:
        setTimeout(() => dispatch(setSelectedMenu(null)), 100);
        redo();
        break;
      case WhiteboardMenuConstants.UNDO:
        setTimeout(() => dispatch(setSelectedMenu(null)), 100);
        undo();
        break;
      case WhiteboardMenuConstants.SAVE: {
        documentApi.saveDocument({
          documentId: params.split(":")[1],
          data: elements,
          name: document.title,
        });
        setTimeout(() => dispatch(setSelectedMenu(null)), 100);
        break;
      }
      default:
        break;
    }
  }, [selectedMenu]);

  const getAttributes = (e, canvas) => {
    let { clientX: positionX, clientY: positionY } = e;
    let top = 0,
      left = 0;
    if (canvas?.getBoundingClientRect()) {
      top = canvas.getBoundingClientRect().top;
      left = canvas.getBoundingClientRect().left;
    }

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
  const setSelectedBoundary = (event, elements, generator, canvas) => {
    let { top, left } = canvas.getBoundingClientRect();
    if (elements.length > 0) {
      let selectedElement = getSelectedELement(
        { x: event.clientX - left, y: event.clientY - top },
        elements,
        generator
      );

      setSelectedElement(selectedElement);
    }
  };
  const handleMouseMove = (e) => {
    let mouseAction = "default";
    if (WhiteboardMenuConstants.MOVE) {
      mouseAction = getMouseCursor(selectedElement, getAttributes(e, canvas));
      e.target.style.cursor = mouseAction;
    }
    if (!drawing) return;
    let attributes = getAttributes(e, canvas);
    if (selectedMenu !== null) {
      let index = elements.length - 1;
      if (index < 0) return;
      if (selectedMenu === WhiteboardMenuConstants.ERASE) {
        let elementsCopy = [...elements];
        elementsCopy = elementsCopy.filter(({ id }, idx) => {
          return id !== selectedElement.id;
        });
        setElements(elementsCopy, true);
      } else {
        if (selectedMenu === WhiteboardMenuConstants.MOVE) {
          index = selectedElement.id;
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
        setElements(elementsCopy, true);
      }
    }
  };

  const handleMouseDown = (event) => {
    setDrawing(true);
    let attributes = getAttributes(event, canvas);
    if (selectedMenu !== null) {
      if (
        selectedMenu === WhiteboardMenuConstants.MOVE ||
        selectedMenu === WhiteboardMenuConstants.ERASE
      ) {
        setSelectedBoundary(event, elements, generator, canvas);
      } else {
        let id = elements.length;
        let element = configureElement(id, attributes, generator, selectedMenu);
        setElements((prev) => [...prev, element]);
      }
    }
  };
  const handleMouseUp = (event) => {
    setDrawing(false);
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
