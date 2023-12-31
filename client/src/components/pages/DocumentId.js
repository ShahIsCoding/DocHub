import React, { useEffect, useState } from "react";
import docImages from "../assets/images/docImages.png";
import { documentOptions } from "../constants/DocumentOptions";
import SharingModel from "../component/SharingModel";
import { Link, useLocation } from "react-router-dom";
import { handleDocument } from "../utils/documentUtils";

const DocumentId = ({ socket }) => {
  const [documentName, setDocumentName] = useState("Untitled Document");
  const [isSharingModelOpen, setSharingModel] = useState(false);
  const location = useLocation();
  const { key } = location.state;

  function hanldeSharing() {
    setSharingModel((value) => !value);
  }
  useEffect(() => {
    document.title = documentName;
  }, [documentName]);

  return (
    <div className="w-screen">
      <div className="header h-20 w-full">
        <div className="flex flex-row p-2 w-full">
          <Link to="/document/home">
            <img src={docImages} alt="doc" className="w-8 h-12" />
          </Link>

          <div className="flex flex-col p-1 flex-1 float-left">
            <input
              className="font-bold"
              onChange={(e) => setDocumentName(e.target.value)}
              value={documentName}
            />
            <div className="flex flex-row gap-2">
              {documentOptions.map((option, idx) => (
                <div>{option}</div>
              ))}
            </div>
          </div>
          <div className="flex flex-row float-right">
            <div
              className="my-auto mx-4 rounded bg-blue-300 py-2 px-5 cursor-pointer"
              onClick={hanldeSharing}
            >
              Share
            </div>
            <div className="my-auto mx-5 ml-auto cursor-pointer">
              <img
                src={docImages}
                alt="profilepicture"
                className="h-10 w-10 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
      {handleDocument(key, socket)}
      <SharingModel open={isSharingModelOpen} setOpen={setSharingModel} />
    </div>
  );
};

export default DocumentId;
