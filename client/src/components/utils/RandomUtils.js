import { WhiteboardMenuConstants } from "../constants/WhiteboardOptions";

export const randomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + randomColor;
};
export function isInQuad(x, y, currX, currY, prevX, prevY) {
  return (
    Math.min(currX, prevX) <= x &&
    Math.max(currX, prevX) >= x &&
    Math.min(currY, prevY) <= y &&
    Math.max(currY, prevY) >= y
  );
}
export function distanceFromPointToLine(x0, y0, x1, y1, x2, y2) {
  const numerator = abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);
  const denominator = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
  return numerator / denominator;
}

export const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export function isOnLine(x, y, currX, currY, prevX, prevY, maxDistance = 1) {
  const a = { x: prevX, y: prevY };
  const b = { x: currX, y: currY };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return abs(offset) < maxDistance ? true : false;
}
export const getRadian = (width, height) => {
  if (width === 0) return 1;
  let rad = Math.atan2(height, width);
  if (rad < 0) rad = abs(rad) + Math.PI;
  return rad;
};
export const getDistance = (element, pos) => {
  if (element === null) return;
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
export const nearestELement = (elements, pos) => {
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
