const io = require("socket.io")(3001, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {

    socket.on('send-changes',(delta)=>{
        socket.brodcast.emit('receive-changes',delta);
    })
    console.log("connected");
});
