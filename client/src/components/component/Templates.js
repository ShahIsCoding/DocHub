import React from "react";
import { useNavigate } from "react-router-dom";
import uuidv4 from "../utils/UUID";
import { docType } from "../constants/DocumentOptions";

const Templates = () => {
  const navigate = useNavigate();
  const handleClick = (key) => {
    let UUID = uuidv4();
    navigate(`/document/doc/${UUID}`, { state: { key } });
  };
  return (
    <div className="bg-slate-200 py-3 border">
      <div className="mx-auto w-2/3">
        <div className="text-md py-2">Start a new Document</div>
        <div className="flex flex-row h-full gap-4 mx-3">
          <div
            className="flex flex-col text-center cursor-pointer"
            onClick={() => handleClick(docType.document)}
          >
            <div className="bg-white h-48 w-36 border"></div>
            <div className="font-bold py-2">Blank Document</div>
          </div>
          <div
            className="flex flex-col text-center cursor-pointer"
            onClick={() => handleClick(docType.whiteboard)}
          >
            <div className="bg-white h-48 w-52 border rounded-md"></div>
            <div className="font-bold py-2">Blank Whiteboard</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;
