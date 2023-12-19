import React, { useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { toolbarOptions } from "./ToolbarOptions";

const TextEditor = () => {
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    new Quill(editor, {
      modules: {
        toolbar: toolbarOptions,
      },
      theme: "snow",
    });

    return () => {
      wrapperRef.innerHTML = "";
    };
  }, []);
  return (
    <>
      <div className="editor text-center" ref={wrapperRef}></div>
    </>
  );
};

export default TextEditor;
