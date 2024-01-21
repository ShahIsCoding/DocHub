import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";

import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import DocumentId from "./components/pages/DocumentId";
import { io } from "socket.io-client";
import { handleConnection } from "./components/utils/ioUtils";
import { useSelector } from "react-redux";

function App() {
  const [socket, setSocket] = useState();
  const login = useSelector((state) => state.login);
  const { token } = login;
  useEffect(() => {
    handleConnection(setSocket, io);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="document"
          element={token === null ? <Navigate to="/login" /> : <Outlet />}
        >
          <Route path="home" element={<Home />} />
          <Route path="doc/:id" element={<DocumentId socket={socket} />} />
        </Route>
        <Route path="/" element={<Navigate to="login" />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
