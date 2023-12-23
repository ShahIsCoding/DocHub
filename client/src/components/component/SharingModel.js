import React from "react";

const SharingModel = ({ open, setOpen }) => {
  return (
    open && (
      <div className="h-screen w-screen bg-slate-300 z-10 absolute">
        <div className="flex justify-center items-center h-full">
          <div className="w-3/5 h-2/5 bg-slate-100">model</div>
        </div>
      </div>
    )
  );
};

export default SharingModel;
