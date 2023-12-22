import React from "react";
import Navbar from "../component/Navbar";
import Templates from "../component/Templates";
import RecentDocuments from "../component/RecentDocuments";

const Home = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <Templates />
      <RecentDocuments />
    </div>
  );
};

export default Home;
