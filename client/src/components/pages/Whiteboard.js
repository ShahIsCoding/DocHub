import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Canvas from "../component/Canvas";
import {
  WhiteboardMenuConstants,
  WhiteboardOptionsConstants,
} from "../constants/WhiteboardOptions";
import { setPrevSelectedMenu } from "../redux/reducers/MenuReducer";
import WhiteBoardMenuDisplay from "../component/WhiteBoardMenuDisplay";
import { useParams } from "react-router-dom";
import rough from "roughjs";
const Whiteboard = ({ socket }) => {
  const { PEN, ERASE } = WhiteboardMenuConstants;

  const menu = useSelector((state) => state.menu);
  const { color, size, selectedMenu, prevSelectedMenu } = menu;

  const dispatch = useDispatch();
  const { id: documentId } = useParams();
  const [canvas, setCanvas] = useState(null);
  const [context, setContext] = useState(null);
  const [roughContext, setRoughContext] = useState(null);
  const [currPos, setCurrPos] = useState({ x: null, y: null });

  useEffect(() => {
    if (canvas === null) return;
    setContext(canvas.getContext("2d"));
    setRoughContext(rough.canvas(canvas));
  }, [canvas]);
  const Drawing = (e, ctx, attributes, isRecieved) => {
    if (ctx === null) return;
    if (e.buttons !== 1 && !isRecieved) {
      dispatch(setPrevSelectedMenu(null));
      return;
    }
    ctx.linearPath(
      [
        [attributes.prevPosX, attributes.prevPosY],
        [attributes.currPosX, attributes.currPosY],
      ],
      {
        stroke: attributes.color,
        roughness: 0.5,
        strokeWidth: attributes.size,
      }
    );
  };
  const Erasing = (e, context, attributes, isRecieved) => {
    if (context === null) return;
    if (attributes.selectedMenu === ERASE) {
      context.clearRect(
        attributes.currPosX,
        attributes.currPosY,
        attributes.size * 10,
        attributes.size * 10
      );
    }
  };
  const getActionCallback = (e, attributes, isRecieved) => {
    let { top, left } = canvas.getBoundingClientRect();
    let newAttributes = isRecieved
      ? attributes
      : {
          color,
          size,
          selectedMenu,
          currPosX: e.clientX - left,
          currPosY: e.clientY - top,
          prevPosX: currPos.x - left,
          prevPosY: currPos.y - top,
        };
    isRecieved && console.log(newAttributes);
    switch (selectedMenu) {
      case PEN:
        Drawing(e, roughContext, newAttributes, isRecieved);
        break;
      case ERASE:
        Erasing(e, context, newAttributes, isRecieved);

        break;
      default:
        break;
    }
    if (!isRecieved) {
      setCurrPos({
        x: e.clientX,
        y: e.clientY,
      });
    }
    if (!isRecieved) socket.emit("send-changes", newAttributes);
  };
  useEffect(() => {
    if (context === null) return;
    switch (selectedMenu) {
      case WhiteboardMenuConstants.SQUARE:
        roughContext.rectangle(15, 15, 80, 80, { roughness: 0.1, fill: color });
        break;
      case WhiteboardMenuConstants.RECTANGLE:
        roughContext.rectangle(15, 15, 80, 180, {
          roughness: 0.1,
          fill: color,
        });
        break;
      case WhiteboardMenuConstants.CIRCLE:
        roughContext.circle(115, 115, 80, 80, { roughness: 0.1, fill: color });
      default:
        break;
    }
  }, [selectedMenu]);
  useEffect(() => {
    if (socket == null) return;
    socket.once("load-document", (document) => {});
    socket.emit("get-document", documentId);
  }, [socket, documentId]);
  useEffect(() => {
    if (socket == null) return;
    const handleChange = (attributes) => {
      getActionCallback({ buttons: 0 }, context, attributes, true);
    };
    socket.on("receive-changes", handleChange);
  }, [socket]);

  return (
    <div className="flex flex-col">
      <div className=" border p-1 " style={{ left: 0, top: 0 }}>
        <WhiteBoardMenuDisplay Menu={WhiteboardOptionsConstants} />
      </div>
      <div className="w-full h-full">
        <Canvas
          actionCallback={getActionCallback}
          canvas={canvas}
          setCanvas={setCanvas}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
