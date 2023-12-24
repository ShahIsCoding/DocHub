import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import DocumentId from "./components/pages/DocumentId";
import Whiteboard from "./components/pages/Whiteboard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/document/home" element={<Home />} />
        <Route path="/document/doc/:id" element={<DocumentId />} />
        <Route path="/document/whiteboard/:id" element={<Whiteboard />} />
      </Routes>
    </Router>
  );
}

export default App;
