import { WhiteboardMenuConstants } from "../constants/WhiteboardOptions";
import {
  distanceFromPointToLine,
  getRadian,
  isInQuad,
  isOnLine,
  nearestELement,
} from "./RandomUtils";

const Drawing = (id, generator, attributes, type) => {
  const { LINE } = WhiteboardMenuConstants;
  let { currX, currY, prevX, prevY, previousPath, color } = attributes;
  if (type === LINE) {
    let path = generator.line(prevX, prevY, currX, currY, {
      roughness: 1,
      stroke: attributes.color,
    });
    return { id, attributes, path, type };
  }
  let currentPath = [];
  previousPath?.forEach((item, indx) => {
    console.log(item);
    currentPath.push(item);
  });
  currentPath = [
    ...currentPath,
    [prevX, prevY],
    [currX, currY],
    {
      stroke: attributes.color,
      roughness: 0.8,
    },
  ];

  let path = generator.linearPath([...currentPath], {
    stroke: color,
    roughness: 0.8,
  });
  const updatedAttributes = { ...attributes, previousPath: currentPath };

  return { id, attributes: updatedAttributes, path, type };
};
const Arc = (id, generator, attributes, type) => {
  let { currX, currY, prevX, prevY, color, size } = attributes;
  let width = currX - prevX;
  let height = currY - prevY;
  let radius = Math.max(Math.abs(width) + 1, Math.abs(height) + 1);

  let path = generator.arc(
    prevX,
    prevY,
    radius,
    radius,
    0,
    getRadian(width, height),
    true,
    {
      stroke: color,
    }
  );
  return { id, attributes, path, type };
};

function QuadCurve(id, generator, attributes, type) {
  let { currX, currY, prevX, prevY, color } = attributes;
  const { SQUARE } = WhiteboardMenuConstants;
  let width = currX - prevX;
  let height = currY - prevY;
  if (type === SQUARE) {
    let modvalue = Math.min(Math.abs(width), Math.abs(height));
    width = modvalue * (width < 0 ? -1 : 1);
    height = modvalue * (height < 0 ? -1 : 1);
  }

  let path = generator.rectangle(prevX, prevY, width, height, {
    roughness: 0.9,
    stroke: color,
  });
  return { id, attributes, path, type };
}
const updateElement = (element, currAttributes, generator, selectedMenu) => {
  const { PEN, SQUARE, RECTANGLE, LINE, MOVE, CIRCLE } =
    WhiteboardMenuConstants;
  let { id, type, attributes: prevAttributes } = element;

  if (selectedMenu === MOVE) {
    let offsetX = currAttributes.currX - prevAttributes.prevX;
    let offsetY = currAttributes.currY - prevAttributes.prevY;
    currAttributes.color = prevAttributes.color;
    currAttributes.size = prevAttributes.size;
    currAttributes.prevX = prevAttributes.prevX + offsetX;
    currAttributes.prevY = prevAttributes.prevY + offsetY;
    currAttributes.currX = prevAttributes.currX + offsetX;
    currAttributes.currY = prevAttributes.currY + offsetY;
  } else {
    if (selectedMenu === PEN) {
      currAttributes.prevX = prevAttributes.currX;
      currAttributes.prevY = prevAttributes.currY;
      currAttributes.previousPath = prevAttributes.previousPath;
    } else {
      currAttributes.prevX = prevAttributes.prevX;
      currAttributes.prevY = prevAttributes.prevY;
    }
  }
  let updatedElement = configureElement(id, currAttributes, generator, type);
  return updatedElement;
};
const configureElement = (id, attributes, generator, type) => {
  const { PEN, SQUARE, RECTANGLE, LINE, CIRCLE } = WhiteboardMenuConstants;
  switch (type) {
    case LINE:
      return Drawing(id, generator, attributes, type);
    case PEN:
      return Drawing(id, generator, attributes, type);
    case SQUARE:
    case RECTANGLE:
      return QuadCurve(id, generator, attributes, type);
    case CIRCLE:
      return Arc(id, generator, attributes, type);
    default:
      break;
  }
};

const getSelectedELement = (pos, elements, generator) => {
  let { x, y } = pos;
  const { SQUARE, RECTANGLE, PEN } = WhiteboardMenuConstants;
  let filteredElements = elements.filter(({ type, attributes, id }, idx) => {
    let { currX, currY, prevX, prevY } = attributes;
    switch (type) {
      case PEN:
        return false;
      case SQUARE:
      case RECTANGLE:
        return isInQuad(x, y, currX, currY, prevX, prevY);
      default:
        return isOnLine(x, y, currX, currY, prevX, prevY);
    }
  });
  let element = JSON.parse(
    JSON.stringify(nearestELement(filteredElements, pos))
  );
  let offset = 10;
  let newAttributes = {
    currX: element.attributes.currX + offset,
    currY: element.attributes.currY + offset,
    prevX: element.attributes.prevX - offset,
    prevY: element.attributes.prevY - offset,
    color: "white",
  };
  let res = configureElement(
    element.id,
    newAttributes,
    generator,
    element.type
  );
  console.log(res);
  return res;
};

const abs = (a) => Math.abs(a);

const getMouseCursor = (element, attributes) => {
  if (attributes === null || element === null) return "default";
  let { currX, currY, prevX, prevY } = element.attributes;
  let { currX: X, currY: Y } = attributes;

  if (isInQuad(X, Y, currX, currY, prevX, prevY)) return "move";
  const offset = 10;
  if (
    (abs(X - prevX) <= offset && abs(Y - prevY) <= offset) ||
    (abs(X - currX) <= offset && abs(Y - currY) <= offset)
  )
    return "nwse-resize";
  if (
    (abs(X - currX) <= offset && abs(Y - prevY) <= offset) ||
    (abs(X - prevX) <= offset && abs(Y - currY) <= offset)
  )
    return "nesw-resize";
  if (
    abs(distanceFromPointToLine(X, Y, currX, currY, prevX, currY)) <= offset ||
    abs(distanceFromPointToLine(X, Y, prevX, prevY, currX, prevY)) <= offset
  ) {
    return "ns-resize";
  }
  if (
    abs(distanceFromPointToLine(X, Y, currX, currY, currX, prevY)) <= offset ||
    abs(distanceFromPointToLine(X, Y, prevX, prevY, prevX, currY)) <= offset
  ) {
    return "ew-resize";
  }

  return "default";
};
export { configureElement, getSelectedELement, updateElement, getMouseCursor };
