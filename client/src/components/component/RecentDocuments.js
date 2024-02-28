import React, { useEffect, useState } from "react";
import { documentApi, userApi } from "../service/api";
import { docType } from "../constants/DocumentOptions";
import { useNavigate } from "react-router-dom";

const RecentDocuments = () => {
  const [doc, setDoc] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    doc === null &&
      userApi.getDocuments(
        (doc) => {
          setDoc(doc.documents);
        },
        (err) => console.error(err)
      );
  }, [doc]);

  const handleDelete = (doc) => {
    documentApi.removeDocuemnt(
      doc._id,
      (resp) => {
        setDoc((prev) => prev.filter((item) => item._id !== doc._id));
      },
      (err) => console.error(err)
    );
  };
  const handleOpen = (item) => {
    console.log(item);
    let url = item.type + ":" + item._id.split(":")[1];
    navigate(`/document/doc/${url}`, {});
  };
  const Documents = (doc) => {
    if (doc?.length > 0) {
      return doc.map((item, index) => {
        return (
          <div
            className={`border rounded hover:shadow-lg  ${
              item.type === docType.document ? "w-44" : "w-52"
            }`}
          >
            <div className="flex flex-col text-center cursor-pointer ">
              <div
                className={`bg-white h-48  border rounded-md ${
                  item.type === docType.document ? "w-44" : "w-52"
                }`}
              ></div>
              <div className="font-bold py-2">{item.name}</div>
              <div className="text-gray-400">{item.type}</div>
              <div>
                <h6 className="text-xs text-gray-500">
                  {item.lastUpdated.split("T")[0]}
                </h6>
                <h6 className="text-xs text-gray-500">
                  {item.lastUpdated.split("T")[1]}
                </h6>
              </div>
            </div>

            <div className="w-full p-4 flex flex-row justify-between">
              <div
                className="hover:bg-blue-500 p-3 rounded cursor-pointer"
                onClick={() => handleOpen(item)}
              >
                Open
              </div>
              <div
                className="hover:bg-red-500 p-3 rounded cursor-pointer"
                onClick={() => handleDelete(item)}
              >
                Delete
              </div>
            </div>
          </div>
        );
      });
    }
  };
  return (
    <div className="bg-slate-100 h-2/3 overflow-y-scroll">
      <div className="mx-auto w-2/3 my-5 ">
        <h6>Number of Docuemnts : {doc?.length}</h6>
        <div className="flex flex-row h-full gap-4 mx-3 flex-wrap ">
          {Documents(doc)}
        </div>
      </div>
    </div>
  );
};

export default RecentDocuments;
