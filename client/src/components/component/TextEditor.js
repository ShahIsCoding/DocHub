import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import { toolbarOptions } from "../constants/ToolbarOptions";

import { io } from "socket.io-client";

import {
  handleConnection,
  handleReceivedChanges,
  handleTextChange,
} from "../utils/TextEditorFunctions";

const TextEditor = () => {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const { id: documentId } = useParams();

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const _quill = new Quill(editor, {
      modules: {
        toolbar: toolbarOptions,
      },
      theme: "snow",
    });
    _quill.disable();
    _quill.setContents(":OADING");
    setQuill(_quill);
    return () => {
      wrapperRef.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    handleConnection(setSocket, io);
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;
    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });
    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);
  useEffect(() => {
    if (socket == null || quill == null) return;
    handleTextChange(socket, quill);
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    handleReceivedChanges(socket, quill);
  }, [socket, quill]);

  return (
    <>
      <div className="editor text-center" ref={wrapperRef}></div>
    </>
  );
};

export default TextEditor;
