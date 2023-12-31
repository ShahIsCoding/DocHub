import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { MdCopyAll } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
const SharingModel = ({ open, setOpen }) => {
  function handleAddEmail() {
    setEmailIdList([...emailIdList, email]);
    setEmail("");
  }
  function handleDeleteEmail(idx) {
    setEmailIdList((prevList) => prevList.filter((_, i) => i !== idx));
  }
  function handleCopyUrl() {
    navigator.clipboard.writeText(location.pathname);
  }
  const [emailIdList, setEmailIdList] = useState([]);
  const [email, setEmail] = useState("");
  const location = useLocation();
  return (
    open && (
      <div
        className={`absolute z-10 inset-0 bg-slate-600 bg-opacity-80 flex items-center justify-center ${
          open ? "" : "hidden"
        }`}
      >
        <div className="w-2/5 h-2/5 bg-slate-200 flex flex-col p-2 rounded">
          <div className="flex flex-row">
            <div className="flex-1">Share the Doc</div>
            <div
              className=" float-right cursor-pointer"
              onClick={(e) => setOpen(false)}
            >
              <IoIosClose fontSize="1.5rem" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="m-2 overflow-x-auto overflow-y-hidden h-16 flex flex-row">
              {emailIdList?.length >= 0
                ? emailIdList?.map((email, idx) => (
                    <div className="flex flex-row p-2 bg-slate-300 rounded-full m-1 my-auto">
                      <div className="inline">{email}</div>
                      <IoIosClose
                        className="inline float-right"
                        fontSize="1.5rem"
                        onClick={() => handleDeleteEmail(idx)}
                      />
                    </div>
                  ))
                : null}
            </div>
            <input
              className="p-3 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? handleAddEmail() : null)}
              type="email"
            />
            <button
              onClick={handleAddEmail}
              className="p-2 bg-blue-300 my-2 rounded"
            >
              Add Email
            </button>
            <button
              onClick={handleCopyUrl}
              className="p-2 bg-orange-300 my-2 rounded flex flex-row items-center justify-center"
            >
              <MdCopyAll fontSize="2rem" />
              <div>Copy URL</div>
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default SharingModel;
