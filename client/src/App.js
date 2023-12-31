import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import DocumentId from "./components/pages/DocumentId";
import { io } from "socket.io-client";
import { handleConnection } from "./components/utils/ioUtils";

function App() {
  const [socket, setSocket] = useState();
  useEffect(() => {
    handleConnection(setSocket, io);
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="login" />} />
        <Route path="login" element={<Login />} />
        <Route path="document">
          <Route path="home" element={<Home />} />
          <Route path="doc/:id" element={<DocumentId socket={socket} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
