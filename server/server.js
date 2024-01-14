const io = require("socket.io")(3001, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", (documentId) => {
    const data = "";
    socket.join(documentId);
    socket.emit("load-document", data);
    socket.on("send-changes", (data) => {
      console.log(data);
      socket.broadcast.to(documentId).emit("receive-changes", data);
    });
    socket.on("whiteboardChanges", (data) => {
      socket.broadcast.to(documentId).emit("wb-receive-changes", data);
    });
  });
  console.log("connected");
});
