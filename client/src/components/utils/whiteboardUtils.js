import { WhiteboardMenuConstants } from "../constants/WhiteboardOptions";

const Drawing = (id, generator, attributes, type) => {
  const { LINE } = WhiteboardMenuConstants;
  if (type === LINE) {
    let path = generator.line(
      attributes.prevX,
      attributes.prevY,
      attributes.currX,
      attributes.currY,
      {
        roughness: 1,
        stroke: attributes.color,
      }
    );
    return { id, attributes, path, type };
  }
  let previousPath = [];
  if (attributes?.prevpath?.length > 0)
    previousPath.push(...attributes.prevpath);
  previousPath.push([attributes.prevX, attributes.prevY]);
  previousPath.push([attributes.currX, attributes.currY]);
  console.log({ ...previousPath });
  let path = generator.linearPath([...previousPath], {
    stroke: attributes.color,
    roughness: 0.8,
  });
  attributes.prevpath = previousPath;
  console.log("new", { ...previousPath });
  return { id, attributes, path, type };
};
const Arc = (id, generator, attributes, type) => {
  let { currX, currY, prevX, prevY, color } = attributes;
  let path = generator.arc(
    prevX,
    prevY,
    200,
    200,
    0,
    getRadian(prevX, prevY, currX, currY),
    true,
    {
      stroke: color,
      roughness: 0.8,
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
    fill: color,
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

    if (type === PEN || type === LINE) {
    } else if (type === SQUARE || type === RECTANGLE) {
      currAttributes.prevX = prevAttributes.prevX + offsetX;
      currAttributes.prevY = prevAttributes.prevY + offsetY;
      currAttributes.currX = prevAttributes.currX + offsetX;
      currAttributes.currY = prevAttributes.currY + offsetY;
    }
  } else {
    if (selectedMenu === PEN) {
      currAttributes.prevX = prevAttributes.currX;
      currAttributes.prevY = prevAttributes.currY;
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
function isInQuad(x, y, currX, currY, prevX, prevY) {
  return (
    Math.min(currX, prevX) <= x &&
    Math.max(currX, prevX) >= x &&
    Math.min(currY, prevY) <= y &&
    Math.max(currY, prevY) >= y
  );
}
const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

function isOnLine(x, y, currX, currY, prevX, prevY, maxDistance = 1) {
  const a = { x: prevX, y: prevY };
  const b = { x: currX, y: currY };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? true : false;
}
const getRadian = (x1, y1, x2, y2) => {
  let rad = Math.atan2(y2 - y1, x2 - x1);
  console.log(rad);
  return rad;
};
const getSelectedELementId = (pos, elements) => {
  let { x, y } = pos;
  const { SQUARE, RECTANGLE } = WhiteboardMenuConstants;
  let filteredElements = elements.filter(({ type, attributes, id }, idx) => {
    let { currX, currY, prevX, prevY } = attributes;
    switch (type) {
      case SQUARE:
      case RECTANGLE:
        return isInQuad(x, y, currX, currY, prevX, prevY);
      default:
        return isOnLine(x, y, currX, currY, prevX, prevY);
    }
  });
  if (filteredElements.length > 0) {
    return filteredElements[filteredElements.length - 1].id;
  } else return null;
};
export { configureElement, getSelectedELementId, updateElement };
