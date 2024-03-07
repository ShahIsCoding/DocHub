import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotificaitonVisible } from "../redux/reducers/NotificationReducer";

const Notification = () => {
  const state = useSelector((state) => state.notificaiton);
  const { message, statusCode, visible } = state;
  const dispatch = useDispatch();
  const getColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) {
      return "bg-green-500 text-white";
    } else if (statusCode >= 300 && statusCode < 400) {
      return "bg-blue-500 text-white";
    } else if (statusCode >= 400 && statusCode < 500) {
      return "bg-yellow-500 text-white";
    } else if (statusCode >= 500) {
      return "bg-red-500 text-white";
    } else {
      return "bg-gray-500 text-white";
    }
  };
  function handleClose() {
    dispatch(setNotificaitonVisible(false));
  }
  useEffect(() => {
    let interval;
    if (visible) {
      interval = setInterval(() => handleClose(), 5000);
    }
    return () => clearInterval(interval);
  }, [visible]);
  return (
    visible && (
      <div
        key={new Date().toISOString}
        className={`fixed bottom-4 right-4 py-2 px-4 rounded shadow-md flex flex-row items-center ${getColor(
          statusCode
        )}`}
      >
        <p>{message}</p>
        <button
          onClick={handleClose}
          className={`ml-2 p-2  rounded-full hover:bg-slate-300 focus:outline-none ${getColor(
            statusCode
          )}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.293 5.293a1 1 0 0 1 1.414 1.414L11.414 12l4.293 4.293a1 1 0 1 1-1.414 1.414L10 13.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 12 4.293 7.707a1 1 0 0 1 1.414-1.414L10 10.586l4.293-4.293z"
            />
          </svg>
        </button>
      </div>
    )
  );
};

export default Notification;
