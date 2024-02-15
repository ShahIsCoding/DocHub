import { FaPen, FaReact, FaRedo, FaShapes, FaUndo } from "react-icons/fa";
import { BsFillEraserFill } from "react-icons/bs";
import { PiLineSegment, PiRectangleDuotone } from "react-icons/pi";
import { GiSquare } from "react-icons/gi";
import { PiCircleDuotone } from "react-icons/pi";
import { IoMoveOutline } from "react-icons/io5";

export const WhiteboardMenuConstants = {
  BASIC: "BASIC",
  PEN: "PEN",
  COLOR: "COLOR",
  SIZE: "SIZE",
  ERASE: "ERASE",
  SHAPES: "SHAPES",
  RECTANGLE: "RECTANGLE",
  SQUARE: "SQUARE",
  CIRCLE: "CIRCLE",
  LINE: "LINE",
  MOVE: "MOVE",
  TOOLS: "TOOLS",
  UNDO: "UNDO",
  REDO: "REDO",
};
export const WhiteboardOptionsConstants = [
  {
    key: 1,
    Name: WhiteboardMenuConstants.BASIC,
    child: true,
    childOptions: [
      {
        key: 1.1,
        Name: WhiteboardMenuConstants.COLOR,
        child: false,
      },
      {
        key: 1.2,
        Name: WhiteboardMenuConstants.SIZE,
        child: false,
      },
    ],
  },
  {
    Name: WhiteboardMenuConstants.TOOLS,
    child: true,
    childOptions: [
      {
        key: 1.3,
        Name: WhiteboardMenuConstants.ERASE,
        icon: <BsFillEraserFill />,
        child: false,
      },
      {
        key: 1.4,
        Name: WhiteboardMenuConstants.MOVE,
        icon: <IoMoveOutline />,
        child: false,
      },
      {
        key: 1.5,
        Name: WhiteboardMenuConstants.UNDO,
        icon: <FaUndo />,
        child: false,
      },
      {
        key: 1.6,
        Name: WhiteboardMenuConstants.REDO,
        icon: <FaRedo />,
        child: false,
      },
    ],
  },
  {
    key: 2,
    Name: WhiteboardMenuConstants.SHAPES,
    child: true,
    childOptions: [
      {
        key: 1.0,
        Name: WhiteboardMenuConstants.PEN,
        icon: <FaPen />,
        child: false,
      },
      {
        key: 2.0,
        Name: WhiteboardMenuConstants.LINE,
        icon: <PiLineSegment />,
        child: false,
      },
      {
        key: 2.1,
        Name: WhiteboardMenuConstants.RECTANGLE,
        icon: <PiRectangleDuotone />,
        child: false,
      },
      {
        key: 2.2,
        Name: WhiteboardMenuConstants.SQUARE,
        icon: <GiSquare />,
        child: false,
      },
      // {
      //   key: 2.3,
      //   Name: WhiteboardMenuConstants.CIRCLE,
      //   icon: <PiCircleDuotone />,
      // },
    ],
  },
];
