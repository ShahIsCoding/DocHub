const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const { createServer } = require("http");
require("dotenv").config();
const app = express();
const server = createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("connected", socket.id);
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
const cors = require("cors");

const userRouter = require("./routes/user.router");
const documentRouter = require("./routes/document.router");

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
const { default: mongoose } = require("mongoose");

app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/document", documentRouter);

app.get("/", (req, res) => {
  res.send("SERVER IS RUNNING");
});
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;

db.on("connected", () => {
  console.log(`Mongoose connected`);
});

db.on("error", (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

db.on("disconnected", () => {
  console.log("Mongoose disconnected");
});
const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`);
});
