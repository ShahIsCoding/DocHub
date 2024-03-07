import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { userApi } from "../service/api";
import { setToken, setUserId } from "../redux/reducers/LoginReducer";
import { checkUserValidation } from "../utils/Validation";
import { useDispatch } from "react-redux";
import InputLabel from "../component/InputLabel";
import { setNotification } from "../redux/reducers/NotificationReducer";

const Login = () => {
  const [email, setEmail] = useState("abcd@gmail.com");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("1234");
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigator = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("user-token");

    if (token) {
      dispatch(setToken(token));
    }
    userApi.refreshLogin((data) => {
      if (data.token) {
        dispatch(setToken(data.token));
        dispatch(setUserId(data._id));
        localStorage.setItem("user-token", data.token);
        navigator("/document/home");
      }
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    let payload = {
      name,
      username: email,
      password,
    };

    if (checkUserValidation(payload)) {
      !isLogin &&
        userApi.register(payload, (data) => {
          if (data.token) {
            dispatch(setToken(data.token));
            dispatch(setUserId(data._id));
            localStorage.setItem("user-token", data.token);
            navigator("/document/home");
          }
        });
      isLogin &&
        userApi.login(payload, (data) => {
          if (data.token) {
            dispatch(setToken(data.token));
            dispatch(setUserId(data._id));
            localStorage.setItem("user-token", data.token);
            navigator("/document/home");
          }
        });
    } else {
      dispatch(
        setNotification({
          message: "Wrong Input",
          statusCode: 400,
        })
      );
      dispatch(
        setNotification({
          message: "Wrong Input",
          statusCode: 400,
        })
      );
    }
  }

  return (
    <div className="App h-screen w-screen bg-blue-950">
      <div className="w-full h-full flex items-center justify-center">
        <div className="lg:w-2/6 w-3/5 px-8 py-4 bg-slate-50 rounded-xl">
          <h1 className="text-center font-bold my-5 text-xl ">
            {isLogin ? "Login to your account" : "Create Account"}
          </h1>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <InputLabel label="Name" value={name} setValue={setName} />
            )}

            <InputLabel
              label="Email"
              value={email}
              setValue={setEmail}
              type="email"
            />

            <InputLabel
              label="Password"
              value={password}
              setValue={setPassword}
              type="password"
            />

            <button
              type="submit"
              className="text-white w-full bg-blue-800 text-center p-3 my-3 rounded cursor-pointer"
            >
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>
          <p className="text-center" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? (
              <>
                New to App?{" "}
                <span className="text-blue-800 cursor-pointer">Sign Up</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span className="text-blue-800 cursor-pointer">Login</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
