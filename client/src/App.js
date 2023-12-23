import React from "react";
import TextEditor from "./components/component/TextEditor";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/document" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/document/:id" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
