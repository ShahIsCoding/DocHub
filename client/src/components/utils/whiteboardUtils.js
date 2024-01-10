import { WhiteboardMenuConstants } from "../constants/WhiteboardOptions";

const Drawing = (generator, attributes, isLine) => {
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
    return { attributes, path };
  }
  let previousPath = [];
  if (attributes?.prevpath?.length > 0) previousPath = attributes.prevpath;
  previousPath = [...previousPath, [attributes.currPosX, attributes.currPosY], [attributes.newPosX, attributes.newPosY]];
  console.log(previousPath);
  let path = generator.linearPath(previousPath,
    {
      stroke: attributes.color,
      roughness: 0.4,
    }
  );
  attributes.prevpath = previousPath;
  return { attributes, path };
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

function QuadCurve(generator, attributes) {
  let {
    currPosX,
    currPosY,
    newPosX,
    newPosY,
    isSquare,
    color,
  } = attributes;

  let width = newPosX - currPosX;
  let height = newPosY - currPosY;
  if (isSquare) {
    let modvalue = Math.min(Math.abs(width), Math.abs(height));
    width = modvalue * (width < 0 ? -1 : 1);
    height = modvalue * (height < 0 ? -1 : 1);
  }

  let path = generator.rectangle(currPosX, currPosY, width, height, {
    roughness: 0.2,
    stroke: attributes.color,
  });
  return { attributes, path };
}

const createElement = (attributes, generator) => {
  let { selectedMenu } = attributes;
  const { PEN, ERASE, SQUARE, RECTANGLE, LINE } = WhiteboardMenuConstants;
  switch (selectedMenu) {
    case LINE:
      return Drawing(generator, attributes, true);
    case PEN:
      return Drawing(generator, attributes, false);
    case SQUARE:
      attributes.isSquare = true;
    case RECTANGLE:
      return QuadCurve(generator, attributes);
    default:
      break;
  }
};
export { createElement };
