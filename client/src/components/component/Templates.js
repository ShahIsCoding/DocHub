import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { docType } from "../constants/DocumentOptions";
import { documentApi } from "../service/api";

const Templates = () => {
  const navigate = useNavigate();

  const handleClick = (key) => {
    const getUUID = async (key) => {
      let payload = {
        type: key === docType.document ? "document" : "whiteboard",
      };
      await documentApi.createDocument(
        payload,
        (res) => {
          if (res.type !== undefined && res?._id?.split(":")[1] !== undefined)
            navigate(`/document/doc/${res.type + ":" + res._id.split(":")[1]}`);
        },
        (err) => console.error(err)
      );
    };
    getUUID(key);
  };
  return (
    <div className="bg-slate-200 py-3 border">
      <div className="mx-auto">
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
