import { FaPen, FaShapes } from "react-icons/fa";
import { BsFillEraserFill } from "react-icons/bs";
export const WhiteboardMenuConstants = {
  PEN: "PEN",
  COLOR: "COLOR",
  SIZE: "SIZE",
  ERASE: "ERASE",
  SHAPES: "SHAPES",
};
export const WhiteboardOptionsConstants = [
  {
    key: 0,
    Name: WhiteboardMenuConstants.PEN,
    icon: <FaPen />,
  },
  {
    key: 1,
    Name: WhiteboardMenuConstants.COLOR,
  },
  {
    key: 2,
    Name: WhiteboardMenuConstants.SIZE,
  },
  {
    key: 3,
    Name: WhiteboardMenuConstants.ERASE,
    icon: <BsFillEraserFill />,
  },
  {
    key: 4,
    Name: WhiteboardMenuConstants.SHAPES,
    icon: <FaShapes />,
  },
];
