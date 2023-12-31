function handleReceivedChanges(socket, quill) {
  const handleChanges = (delta) => {
    quill.updateContents(delta);
  };
  socket.on("receive-changes", handleChanges);

  return () => {
    socket.off("receive-changes", handleChanges);
  };
}

function handleTextChange(socket, quill) {
  const handleChange = (delta, oldDelta, source) => {
    console.log(delta, oldDelta);
    if (source !== "user") return;
    socket.emit("send-changes", delta);
  };

  console.log("changing");
  quill.on("text-change", handleChange);
  return () => {
    quill.off("text-change", handleChange);
  };
}

export { handleReceivedChanges, handleTextChange };
