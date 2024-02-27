import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import DocumentId from "./components/pages/DocumentId";
import { io } from "socket.io-client";
import { handleConnection } from "./components/utils/ioUtils";
import { useSelector } from "react-redux";
import { apiConstants } from "./components/constants/apiConstants";

function App() {
  const [socket, setSocket] = useState();
  const nav = useNavigate();
  useEffect(() => {
    apiConstants.navigator = nav;
    handleConnection(setSocket, io);
  }, []);

  return (
    <Routes>
      <Route path="document">
        <Route path="home" element={<Home />} />
        <Route path="doc/:id" element={<DocumentId socket={socket} />} />
      </Route>
      <Route path="/" element={<Navigate to="login" />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default App;
