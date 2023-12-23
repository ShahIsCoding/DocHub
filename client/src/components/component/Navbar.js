import React from "react";
import { MdMoreHoriz } from "react-icons/md";
import { AiOutlineBars } from "react-icons/ai";
import { IoMdSearch } from "react-icons/io";
import docImages from "../assets/images/docImages.png";
const Navbar = () => {
  return (
    <div className="bg-slate-100">
      <div className="flex flex-row h-20">
        <div className="my-auto ml-5">
          <MdMoreHoriz fontSize="2rem" />
        </div>
        <div className="my-auto mx-5 sm:block hidden">
          <h1 className="inline-block px-2 text-xl ">Docs</h1>
          <img src={docImages} alt="Docs" className="inline-block py-2 w-10" />
        </div>
        <div className="my-auto mx-5 sm:block hidden flex-1">
          <div className="flex flex-row bg-slate-200 rounded">
            <IoMdSearch fontSize="2rem" className="my-auto mx-3" />
            <input className="p-3 bg-slate-200 border-0" placeholder="Search" />
          </div>
        </div>
        <div className="my-auto mx-5 sm:block hidden">
          <AiOutlineBars fontSize="2rem" />
        </div>
        <div className="my-auto mx-5 ml-auto">
          <img
            src={docImages}
            alt="profilepicture"
            className="h-10 w-10 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
