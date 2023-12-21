import React from "react";
import { Navigate } from "react-router-dom";
import uuidv4 from "../utils/UUID";

const Home = () => {
  return (
    <div>
      home
      {/* <Navigate to={`/document/${uuidv4()}`} /> */}
    </div>
  );
};

export default Home;
