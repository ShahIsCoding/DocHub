import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import DocumentId from "./components/pages/DocumentId";
import { io } from "socket.io-client";
import { handleConnection } from "./components/utils/ioUtils";
import { constants } from "./components/constants/apiConstants";
import Notification from "./components/component/Notification";
import { useDispatch } from "react-redux";
import { setNotification } from "./components/redux/reducers/NotificationReducer";

function App() {
  const [socket, setSocket] = useState();
  const nav = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    constants.navigator = nav;
    constants.notify = (payload) => dispatch(setNotification(payload));
    handleConnection(setSocket, io);
  }, []);

  return (
    <>
      <Notification />
      <Routes>
        <Route path="document">
          <Route path="home" element={<Home />} />
          <Route path="doc/:id" element={<DocumentId socket={socket} />} />
        </Route>
        <Route path="/" element={<Navigate to="login" />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
