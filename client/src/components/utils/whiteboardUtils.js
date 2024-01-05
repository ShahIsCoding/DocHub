import { useDispatch } from "react-redux";
import { setPrevSelectedMenu } from "../redux/reducers/MenuReducer";
import { WhiteboardMenuConstants } from "../constants/WhiteboardOptions";

const Drawing = (e, ctx, attributes, isRecieved) => {
  //   const dispatch = useDispatch();
  if (ctx === null || (e.buttons !== 1 && !isRecieved)) return;
  ctx.linearPath(
    [
      [attributes.prevPosX, attributes.prevPosY],
      [attributes.currPosX, attributes.currPosY],
    ],
    {
      stroke: attributes.color,
      roughness: 0.5,
      strokeWidth: attributes.size,
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

function handleShapeCreation(selectedMenu, roughContext, attributes) {
  switch (selectedMenu) {
    case WhiteboardMenuConstants.SQUARE:
      roughContext.rectangle(15, 15, 80, 80, {
        roughness: 0.1,
        fill: attributes.color,
      });
      break;
    case WhiteboardMenuConstants.RECTANGLE:
      roughContext.rectangle(15, 15, 80, 180, {
        roughness: 0.1,
        fill: attributes.color,
      });
      break;
    case WhiteboardMenuConstants.CIRCLE:
      roughContext.circle(115, 115, 80, 80, {
        roughness: 0.1,
        fill: attributes.color,
      });
    default:
      break;
  }
}

export { Drawing, Erasing, handleShapeCreation };
