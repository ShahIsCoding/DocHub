import { FaPen, FaShapes } from "react-icons/fa";
import { BsFillEraserFill } from "react-icons/bs";
export const WhiteboardMenuConstants = {
  PEN: "PEN",
  COLOR: "COLOR",
  SIZE: "SIZE",
  ERASE: "ERASE",
  SHAPES: "SHAPES",
  RECTANGLE: "RECTANGLE",
  SQUARE: "SQUARE",
  CIRCLE: "CIRCLE",
  TRIANGLE: "TRIANGLE",
};
export const WhiteboardOptionsConstants = [
  {
    key: 0,
    Name: WhiteboardMenuConstants.PEN,
    icon: <FaPen />,
    child: false,
  },
  {
    key: 1,
    Name: WhiteboardMenuConstants.COLOR,
    child: false,
  },
  {
    key: 2,
    Name: WhiteboardMenuConstants.SIZE,
    child: false,
  },
  {
    key: 3,
    Name: WhiteboardMenuConstants.ERASE,
    icon: <BsFillEraserFill />,
    child: false,
  },
  {
    key: 4,
    Name: WhiteboardMenuConstants.SHAPES,
    icon: <FaShapes />,
    child: true,
    childOptions: [
      {
        key: 4.1,
        Name: WhiteboardMenuConstants.RECTANGLE,
      },
      {
        key: 4.2,
        Name: WhiteboardMenuConstants.SQUARE,
      },
      {
        key: 4.3,
        Name: WhiteboardMenuConstants.CIRCLE,
      },
      {
        key: 4.4,
        Name: WhiteboardMenuConstants.TRIANGLE,
      },
    ],
  },
];
