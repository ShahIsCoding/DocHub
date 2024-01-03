import TextEditor from "../component/TextEditor";
import { docType } from "../constants/DocumentOptions";
import Whiteboard from "../pages/Whiteboard";

export const handleDocument = (type, socket) => {
  switch (type) {
    case docType.whiteboard:
      return <Whiteboard socket={socket} />;
    case docType.document:
      return <TextEditor socket={socket} />;
    default:
      break;
  }
};
