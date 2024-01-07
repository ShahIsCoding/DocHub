import { WhiteboardMenuConstants } from "../constants/WhiteboardOptions";

const Drawing = (ctx, attributes) => {
  //   const dispatch = useDispatch();
  if (ctx === null) return;
  return ctx.linearPath(
    [
      [attributes.currPosX, attributes.currPosY],
      [attributes.newPosX, attributes.newPosY],
    ],
    {
      stroke: attributes.color,
      roughness: 0.4,
    }
  );
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

function QuadCurve(generator, context, attributes) {
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
  context.rect(startPosX, startPosY, width, height);
  context.fillStyle = color;

  let path = generator.rectangle(startPosX, startPosY, width, height, {
    roughness: 0.2,
    stroke: attributes.color,
  });
  return path;
}

const createElement = (attributes, context, generator, roughContext) => {
  let { selectedMenu } = attributes;
  const { PEN, ERASE, SQUARE, RECTANGLE, CIRCLE } = WhiteboardMenuConstants;
  switch (selectedMenu) {
    case PEN:
      return Drawing(roughContext, attributes);
    case SQUARE:
      attributes.isSquare = true;
    case RECTANGLE:
      return QuadCurve(generator, context, attributes);
    default:
      break;
  }
};
export { createElement };
