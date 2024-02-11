const express = require("express");
const http = require("http");
require("dotenv").config();
const app = express();
const server = http.createServer(app);
require("./socketIO");
const cors = require("cors");

const userRouter = require("./router/user.router");
// const documentRouter = require("./router/document.router");

const { default: mongoose } = require("mongoose");

app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
// app.use("/document", documentRouter);

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
