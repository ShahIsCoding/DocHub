import TextEditor from "../component/TextEditor";
import { docType } from "../constants/DocumentOptions";
import Whiteboard from "../pages/Whiteboard";

export const handleDocument = (type, socket, isSaving, setSaving) => {
  switch (type) {
    case docType.whiteboard:
      return (
        <Whiteboard socket={socket} isSaving={isSaving} setSaving={setSaving} />
      );
    case docType.document:
      return (
        <TextEditor socket={socket} isSaving={isSaving} setSaving={setSaving} />
      );
    default:
      break;
  }
};
