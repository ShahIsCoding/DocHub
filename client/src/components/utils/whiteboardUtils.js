import { WhiteboardMenuConstants } from "../constants/WhiteboardOptions";

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
  console.log(prevX, prevY, radius, radius, 0, getRadian(width, height), true);
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
function isInQuad(x, y, currX, currY, prevX, prevY) {
  return (
    Math.min(currX, prevX) <= x &&
    Math.max(currX, prevX) >= x &&
    Math.min(currY, prevY) <= y &&
    Math.max(currY, prevY) >= y
  );
}
function distanceFromPointToLine(x0, y0, x1, y1, x2, y2) {
  const numerator = Math.abs(
    (y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1
  );
  const denominator = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
  return numerator / denominator;
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
const getRadian = (width, height) => {
  if (width === 0) return 1;
  let rad = Math.atan2(height, width);
  if (rad < 0) rad = Math.abs(rad) + Math.PI;
  return rad;
};
const getSelectedELementId = (pos, elements) => {
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
  let res = nearestELement(filteredElements, pos);
  return res.id;
};

const getDistance = (element, pos) => {
  let { x, y } = pos;
  let { type, attributes } = element;
  let { currX, currY, prevX, prevY } = attributes;
  const { SQUARE, RECTANGLE, LINE } = WhiteboardMenuConstants;
  if (type === SQUARE || type === RECTANGLE) {
    let dx = Math.min(
      Math.abs(x - attributes.currX),
      Math.abs(x - attributes.prevX)
    );
    let dy = Math.min(
      Math.abs(y - attributes.currY),
      Math.abs(y - attributes.prevY)
    );
    return Math.min(dx, dy);
  } else if (type === LINE)
    return distanceFromPointToLine(currX, currY, prevX, prevY, x, y);
};
const nearestELement = (elements, pos) => {
  if (elements.length < 0) return null;
  let res = {
    idx: 0,
    dis: getDistance(elements[0], pos),
  };
  for (let i = 1; i < elements.length; i++) {
    let currDis = getDistance(elements[i], pos);
    if (res.dis > currDis)
      res = {
        idx: i,
        dis: currDis,
      };
  }
  return elements[res.idx];
};
const abs = (a) => Math.abs(a);
const getMouseCursor = (element, attributes) => {
  if (attributes === null || element === null) return "default";
  let { currX, currY, prevX, prevY } = element.attributes;
  let { currX: X, currY: Y } = attributes;

  if (isInQuad(X, Y, currX, currY, prevX, prevY)) return "move";

  if (
    (abs(X - prevX) <= 2 && abs(Y - prevY) <= 2) ||
    (abs(X - currX) <= 2 && abs(Y - currY) <= 2)
  )
    return "nwse-resize";
  if (
    (abs(X - currX) <= 2 && abs(Y - prevY) <= 2) ||
    (abs(X - prevX) <= 2 && abs(Y - currY) <= 2)
  )
    return "nesw-resize";
  if (
    abs(distanceFromPointToLine(X, Y, currX, currY, prevX, currY)) <= 2 ||
    abs(distanceFromPointToLine(X, Y, prevX, prevY, currX, prevY)) <= 2
  ) {
    return "ns-resize";
  }
  if (
    abs(distanceFromPointToLine(X, Y, currX, currY, currX, prevY)) <= 2 ||
    abs(distanceFromPointToLine(X, Y, prevX, prevY, prevX, currY)) <= 2
  ) {
    return "ew-resize";
  }

  return "default";
};
export { configureElement, getSelectedELementId, updateElement };
