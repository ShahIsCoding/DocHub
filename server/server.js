const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(3001, {
  cors: {
    origin: "*",
  },
});

const userRouter = require("./router/user.router");
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

app.use(express.json());

app.use("/user", userRouter);
const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
