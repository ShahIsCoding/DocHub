import React from "react";
import TextEditor from "./components/component/TextEditor";

import {
  BrowserRouter as Router,
  Route,
  redirect,
  Routes,
  Navigate,
} from "react-router-dom";

import Home from "./components/pages/Home";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/document/:id" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
