import React, { useEffect, useState } from "react";
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
  getBoundaryElement,
  getMouseCursor,
  getSelectedELement,
  getValidElements,
  getUpdatedElement,
} from "../utils/whiteboardUtils";
import { useHistory } from "../hooks/useHistory";
import { setSelectedMenu } from "../redux/reducers/MenuReducer";
import { documentApi } from "../service/api";
const { v4: uuidv4 } = require("uuid");

const Whiteboard = ({ socket }) => {
  const menu = useSelector((state) => state.menu);
  const { color, size, selectedMenu } = menu;
  const login = useSelector((state) => state.login);
  const { _id: userId } = login;
  const dispatch = useDispatch();

  const { id: documentId } = useParams();
  // canvas and context
  const [canvas, setCanvas] = useState(null);
  const [context, setContext] = useState(null);
  const [boundingClientRect, setBoundingClientRect] = useState({
    top: 0,
    left: 0,
  });
  const [roughContext, setRoughContext] = useState(null);
  const [generator, setGenerator] = useState(null);

  // created paths
  const [userElements, setUserElements, undo, redo] = useHistory([]);
  const [blockedElementId, setBlockedElementId] = useState(new Set());
  const [otherUserElements, setOtherUserElements] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const { id: params } = useParams();

  useEffect(() => {
    if (canvas === null) return;
    setContext(canvas.getContext("2d"));
    setRoughContext(rough.canvas(canvas));
    setGenerator(rough.canvas(canvas).generator);
    setBoundingClientRect({
      top: canvas.getBoundingClientRect().top,
      left: canvas.getBoundingClientRect().left,
    });
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [canvas, socket]);

  useEffect(() => {
    documentApi.getDocument(params.split(":")[1], (resp) =>
      setUserElements(resp.document.data, true)
    );
  }, []);

  useEffect(() => {
    socket.emit("join-document", documentId);
    socket.emit("get-whiteboard-data", (data) => {});
    socket.on("block-whiteboard-elementId", (elementId) => {
      blockedElementId.add(elementId);
      // remove element Id from user
    });
    socket.on("unblock-whiteboard-elementId", (elementId) => {
      blockedElementId.delete(elementId);
    });
    socket.on("updated-whiteboard-data", (newpayload) => {
      // console.log("inside update-whiteBoard", {
      //   otherUserElements,
      //   userElements,
      // });
      let { keys, elementMap } = newpayload;

      let deserializedElementMap = new Map(Object.entries(elementMap));

      const valuesExceptUserId = [];
      keys
        .filter((key) => key !== userId)
        .forEach((key) => {
          let keyArray = deserializedElementMap.get(key);
          valuesExceptUserId.push(...keyArray);
        });
      setOtherUserElements(valuesExceptUserId);
    });
  }, [socket]);

  useEffect(() => {
    if (!context) return;
    if (userElements !== undefined) {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      // console.log({ userElements, otherUserElements, blockedElementId });
      selectedElement !== null &&
        selectedMenu === WhiteboardMenuConstants.MOVE &&
        roughContext.draw(getBoundaryElement(selectedElement, generator).path);
      otherUserElements?.forEach(({ path }, idx) => {
        roughContext.draw(path);
      });
      userElements?.forEach(({ path }, idx) => {
        roughContext.draw(path);
      });
    }
  }, [userElements, otherUserElements]);

  useEffect(() => {
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
          data: userElements,
          name: document.title,
        });
        setTimeout(() => dispatch(setSelectedMenu(null)), 100);
        break;
      }
      default:
        break;
    }
  }, [selectedMenu]);

  const getAttributes = (event) => {
    let { clientX: positionX, clientY: positionY } = event;

    let attributes = {
      color,
      size,
      currX: positionX - boundingClientRect.left,
      currY: positionY - boundingClientRect.top,
      prevX: positionX - boundingClientRect.left,
      prevY: positionY - boundingClientRect.top,
    };
    return attributes;
  };
  const setSelectedBoundary = (event, Elements) => {
    if (Elements.length > 0) {
      let selectedElement = getSelectedELement(
        {
          x: event.clientX - boundingClientRect.left,
          y: event.clientY - boundingClientRect.top,
        },
        Elements
      );
      let payload = {
        data: selectedElement,
      };
      socket.emit("block-whiteboard-elementId", payload);
      setOtherUserElements((prev) =>
        prev.filter((item) => item.id !== selectedElement.id)
      );
      setUserElements((prev) => {
        let element = prev.filter((item) => item.id !== selectedElement.id);
        return element.length > 0
          ? [...element, selectedElement]
          : [selectedElement];
      });
      setSelectedElement(selectedElement);
      return selectedElement.id;
    }
    return null;
  };

  function handleMouseMove(e) {
    let mouseAction = "default";
    let attributes = getAttributes(e, canvas);
    if (WhiteboardMenuConstants.MOVE) {
      mouseAction = getMouseCursor(selectedElement, attributes);
      e.target.style.cursor = mouseAction;
    }
    if (selectedMenu !== null && drawing) {
      let prevElement = selectedElement;
      let updatedElement = getUpdatedElement(
        prevElement,
        attributes,
        generator,
        selectedMenu
      );
      setSelectedElement(updatedElement);
      let elementsCopy = userElements;
      elementsCopy = elementsCopy.filter(
        (item) => item.id !== updatedElement?.id
      );
      elementsCopy = [...elementsCopy, updatedElement];
      setUserElements(elementsCopy, true);
      let payload = {
        data: elementsCopy,
        userId: userId,
      };
      socket.emit("updated-whiteboard-data", payload);
    }
  }

  const handleMouseDown = (event) => {
    setDrawing(true);
    let attributes = getAttributes(event, canvas);
    if (selectedMenu !== null) {
      if (
        selectedMenu === WhiteboardMenuConstants.MOVE ||
        selectedMenu === WhiteboardMenuConstants.ERASE
      ) {
        let selectedElementId = setSelectedBoundary(
          event,
          getValidElements(userElements, otherUserElements, blockedElementId)
        );
        if (selectedMenu === WhiteboardMenuConstants.ERASE) {
          let elementsCopy = userElements;
          elementsCopy = elementsCopy.filter((item, idx) => {
            let { currX, currY, prevX, prevY } = item.attributes;
            return (
              item.id !== selectedElementId &&
              !(currX === prevX && currY === prevY)
            );
          });
          setUserElements(elementsCopy, true);
          let payload = {
            data: elementsCopy,
            userId: userId,
          };
          socket.emit("updated-whiteboard-data", payload);
        }
      } else {
        let id = uuidv4();
        let element = configureElement(id, attributes, generator, selectedMenu);
        let elementsCopy = userElements;
        elementsCopy = [...elementsCopy, element];
        elementsCopy = elementsCopy.filter((item, index) => {
          let { currX, currY, prevX, prevY } = item.attributes;
          return !(currX === prevX && currY === prevY);
        });
        setUserElements(elementsCopy);
        let payload = {
          data: elementsCopy,
          userId: userId,
        };
        socket.emit("updated-whiteboard-data", payload);
        setSelectedElement(element);
        payload = {
          data: element,
        };
        socket.emit("block-whiteboard-elementId", payload);
      }
    }
  };
  const handleMouseUp = (event) => {
    setDrawing(false);
    let payload = {
      data: selectedElement,
    };
    socket.emit("unblock-whiteboard-elementId", payload);
    setSelectedElement(null);
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
