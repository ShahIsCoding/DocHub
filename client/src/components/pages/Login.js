import React, { useState } from "react";

import docImages from "../assets/images/docImages.png";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigator = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    let payload = {
      username,
      password,
    };
    console.log(payload);
    navigator("/document");
  }
  return (
    <div className="h-screen bg-slate-300 flex justify-center">
      <div className="mx-auto my-auto lg:w-1/5 sm:w-2/5 w-4/5 bg-slate-100 flex flex-col rounded p-3 shadow-lg">
        <div className="mx-auto my-3 p-3">
          <img src={docImages} alt="docs" className="w-8 inline" />
          <div className="inline mx-3">DocHub</div>
        </div>
        <form className="mx-auto my-1 w-full" onSubmit={handleSubmit}>
          <div className="flex justify-between items-center my-2">
            <label className="float-left mx-1">Email</label>
            <input
              className="float-right rounded p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center my-2">
            <label className="float-left mx-1 ">password</label>
            <input
              className="float-right rounded p-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="w-full rounded text-center p-3  my-2 bg-slate-200 hover:shadow-lg"
            type="submit"
          >
            Login
          </button>
          <div className="flex justify-between">
            <button className="w-3/5 rounded text-center p-3  m-2 bg-slate-200 hover:shadow-lg">
              GitHub
            </button>
            <button className="w-3/5 rounded text-center p-3  m-2 bg-slate-200 hover:shadow-lg">
              Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
