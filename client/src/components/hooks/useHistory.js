import { useState } from "react";

export const useHistory = (initialState) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action, overwrite = false) => {
    const newState =
      typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const newHistory = history.length === 0 ? [] : [...history];
      newHistory[index] = newState;
      setHistory(newHistory);
    } else {
      const requiredHistory = [...history].slice(0, index + 1);
      setHistory([...requiredHistory, newState]);
      setIndex((prev) => prev + 1);
    }
  };
  const undo = () => {
    index > 0 && setIndex((prev) => prev - 1);
  };
  const redo = () => index < history.length - 1 && setIndex((prev) => prev + 1);
  return [history[index], setState, undo, redo];
};
