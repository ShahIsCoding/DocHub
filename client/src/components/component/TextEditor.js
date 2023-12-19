import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import {
    toolbarOptions
} from "./ToolbarOptions";

import {
    io
} from "socket.io-client";

const TextEditor = () => {
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();

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
        setQuill(_quill);
        return () => {
            wrapperRef.innerHTML = "";
        };
    }, []);

    useEffect(() => {
        const soc = io("http://localhost:3001");
        setSocket(soc);
        return () => {
            soc.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket == null || quill == null) return;

        const handleTextChange = (delta, oldDelta, source) => {
            console.log(delta, oldDelta);
            if (source !== 'user') return;
            socket.emit('send-changes', delta);
        }

        console.log('changing');
        quill.on('text-change', handleTextChange);
        return () => {quill.off('text-change', handleTextChange)}
    }, [socket, quill])


    useEffect(() => {
        if (socket == null || quill == null) return;

        const handleReceivedChanges = (delta) =>{
          console.log('update content',delta);
          quill.updateContents(delta);
        }
        socket.on('receive-changes',handleReceivedChanges);

        return () =>  {socket.off('receive-changes',handleReceivedChanges)}
    }, [socket, quill])



    return  <> <div className = "editor text-center" ref = {wrapperRef} > </div> </>;
};

export default TextEditor;