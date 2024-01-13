import { WhiteboardMenuConstants } from "../constants/WhiteboardOptions";

const Drawing = (id, generator, attributes, isLine) => {
  let { selectedMenu } = attributes;
  if (isLine === true) {
    let path = generator.line(
      attributes.currPosX,
      attributes.currPosY,
      attributes.newPosX,
      attributes.newPosY,
      {
        roughness: 0.3,
        stroke: attributes.color,
      }
    );
    console.log(attributes, path);
    return { id, attributes, path, type: selectedMenu };
  }
  let previousPath = [];
  if (attributes?.prevpath?.length > 0) previousPath = attributes.prevpath;
  previousPath = [
    ...previousPath,
    [attributes.prevX, attributes.prevY],
    [attributes.currX, attributes.currY],
  ];
  console.log(previousPath);
  let path = generator.linearPath(previousPath, {
    stroke: attributes.color,
    roughness: 0.4,
  });
  attributes.prevpath = previousPath;
  return { id, attributes, path, type: selectedMenu };
};
const Erasing = (e, context, attributes, isRecieved) => {
  const { PEN, ERASE } = WhiteboardMenuConstants;
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

function QuadCurve(id, generator, attributes) {
  let { currX, currY, prevX, prevY, isSquare, color, selectedMenu } =
    attributes;

  let width = currX - prevX;
  let height = currY - prevY;
  if (isSquare) {
    let modvalue = Math.min(Math.abs(width), Math.abs(height));
    width = modvalue * (width < 0 ? -1 : 1);
    height = modvalue * (height < 0 ? -1 : 1);
  }

  let path = generator.rectangle(prevX, prevY, width, height, {
    roughness: 0.2,
    stroke: attributes.color,
  });
  return { id, attributes, path, type: selectedMenu };
}
const updateElement = (element, attributes, generator) => {
  const { PEN, ERASE, SQUARE, RECTANGLE, LINE, MOVE } = WhiteboardMenuConstants;
  let { id, type, attributes: prevAttributes } = element;
  let offsetX = attributes.currX - attributes.prevX;
  let offsetY = attributes.currY - attributes.currY;

  if (type === PEN || type === LINE) {
  } else if (type === SQUARE || type === RECTANGLE) {
    attributes.prevX = prevAttributes.prevX + offsetX;
    attributes.prevY = prevAttributes.prevY + offsetY;
    attributes.currX = prevAttributes.currX + offsetX;
    attributes.currY = prevAttributes.currY + offsetY;
  }
  let updatedElement = configureElement(id, attributes, generator);
  return updatedElement;
};
const configureElement = (id, attributes, generator) => {
  let { selectedMenu } = attributes;
  const { PEN, ERASE, SQUARE, RECTANGLE, LINE, MOVE } = WhiteboardMenuConstants;
  switch (selectedMenu) {
    case LINE:
      return Drawing(id, generator, attributes, true);
    case PEN:
      return Drawing(id, generator, attributes, false);
    case SQUARE:
      attributes.isSquare = true;
    case RECTANGLE:
      return QuadCurve(id, generator, attributes);
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
const getSelectedELementId = (pos, elements) => {
  let { x, y } = pos;
  const { PEN, ERASE, SQUARE, RECTANGLE, LINE, MOVE } = WhiteboardMenuConstants;
  elements.map(({ type, attributes, id }, idx) => {
    let { currX, currY, prevX, prevY } = attributes;
    switch (type) {
      case SQUARE:
      case RECTANGLE:
        if (isInQuad(x, y, currX, currY, prevX, prevY)) {
          return id;
        }
        break;
      default:
        if (isOnLine(x, y, currX, currY, prevX, prevY)) {
          return id;
        }
    }
  });
};
export { configureElement, getSelectedELementId, updateElement };
