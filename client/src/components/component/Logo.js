import React from "react";
import docImages from "../assets/images/docImages.png";

const Logo = ({ logo, name, cssName }) => {
  return (
    <div className={`mx-auto my-3 p-3 ${cssName}`}>
      {logo && <img src={docImages} alt="docs" className="w-8 inline" />}
      {name && <div className="inline mx-3">DocHub</div>}
    </div>
  );
};

export default Logo;
