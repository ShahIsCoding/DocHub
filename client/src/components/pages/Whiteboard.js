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

const Whiteboard = ({ socket }) => {
  const { PEN, ERASE } = WhiteboardMenuConstants;

  const menu = useSelector((state) => state.menu);
  const { color, size, selectedMenu, prevSelectedMenu } = menu;

  const dispatch = useDispatch();
  const { id: documentId } = useParams();
  const [context2D, setContext] = useState(null);
  const [currPos, setCurrPos] = useState({ x: null, y: null });

  const Drawing = (e, ctx, attributes, isRecieved) => {
    console.log({ e, ctx, attributes, isRecieved });
    if (ctx === null) return;
    if (e.buttons !== 1 && !isRecieved) {
      dispatch(setPrevSelectedMenu(null));
      return;
    }
    ctx.beginPath();
    if (prevSelectedMenu === PEN || isRecieved) {
      ctx.moveTo(attributes.prevPosX, attributes.prevPosY);
    } else ctx.moveTo(attributes.currPosX, attributes.currPosY);
    ctx.lineTo(attributes.currPosX, attributes.currPosY);
    ctx.strokeStyle = attributes.color;
    ctx.lineWidth = attributes.size;
    ctx.lineCap = attributes.lineCap;
    ctx.stroke();
    if (!isRecieved) dispatch(setPrevSelectedMenu(PEN));
    ctx.closePath();
  };
  const Erasing = (e, ctx) => {
    if (ctx === null) return;
    if (selectedMenu === ERASE) {
      ctx.beginPath();
      ctx.clearRect(e.clientX, e.clientY, e.clientX + size, e.clientY + size);
    }
  };
  const getActionCallback = (e, ctx, attributes, isRecieved) => {
    if (!isRecieved) {
      setCurrPos({ x: e.clientX, y: e.clientY });
    }
    let newAttributes = isRecieved
      ? attributes
      : {
          color,
          size,
          selectedMenu,
          currPosX: e.clientX,
          currPosY: e.clientY,
          prevPosX: currPos.x,
          prevPosY: currPos.y,
        };
    switch (selectedMenu) {
      case PEN:
        Drawing(e, ctx, newAttributes, isRecieved);
        break;
      case ERASE:
        Erasing(e, ctx, newAttributes, isRecieved);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (socket == null) return;
    socket.once("load-document", (document) => {});
    socket.emit("get-document", documentId);
  }, [socket, documentId]);
  useEffect(() => {
    const handleChange = (attributes) => {
      getActionCallback({ buttons: 0 }, context2D, attributes, true);
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
          context2D={context2D}
          setContext={setContext}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
