import { WhiteboardMenuConstants } from "../constants/WhiteboardOptions";

const Drawing = (ctx, rctx, generator, attributes, isLine) => {
  if (ctx === null) return;
  if (isLine === true) {
    let path = generator.line(
      attributes.startPosX,
      attributes.startPosY,
      attributes.newPosX,
      attributes.newPosY,
      {
        roughness: 0.9,
        stroke: attributes.color,
      }
    );
    rctx.draw(path);
    return path;
  }
  let prevpath;
  let path = generator.linearPath(
    [
      [attributes.currPosX, attributes.currPosY],
      [attributes.newPosX, attributes.newPosY],
    ],
    {
      stroke: attributes.color,
      roughness: 0.4,
    }
  );
  // rctx.draw(path);
  // console.log("sending", path, attributes.currElement);
  if (attributes.currElement !== null) {
    prevpath = attributes.currElement;
    prevpath.sets[0].ops.push(...path.sets[0].ops);
  }
  let finalPath = attributes.currElement !== null ? prevpath : path;
  rctx.draw(finalPath);
  return finalPath;
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

function QuadCurve(ctx, rctx, generator, attributes) {
  let {
    currPosX,
    currPosY,
    newPosX,
    newPosY,
    startPosX,
    startPosY,
    isSquare,
    color,
  } = attributes;
  let width = newPosX - startPosX;
  let height = newPosY - startPosY;
  if (isSquare) {
    let modvalue = Math.min(Math.abs(width), Math.abs(height));
    width = modvalue * (width < 0 ? -1 : 1);
    height = modvalue * (height < 0 ? -1 : 1);
  }

  let path = generator.rectangle(startPosX, startPosY, width, height, {
    roughness: 0.2,
    stroke: attributes.color,
  });
  rctx.draw(path);
  return path;
}

const createElement = (attributes, context, generator, roughContext) => {
  let { selectedMenu } = attributes;
  const { PEN, ERASE, SQUARE, RECTANGLE, LINE } = WhiteboardMenuConstants;
  switch (selectedMenu) {
    case LINE:
      return Drawing(context, roughContext, generator, attributes, true);
    case PEN:
      return Drawing(context, roughContext, generator, attributes, false);
    case SQUARE:
      attributes.isSquare = true;
    case RECTANGLE:
      return QuadCurve(context, roughContext, generator, attributes);
    default:
      break;
  }
};
export { createElement };
