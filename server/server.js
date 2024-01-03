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
    socket.on("send-changes", (delta) => {
      console.log(delta);
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });
  });
  console.log("connected");
});
