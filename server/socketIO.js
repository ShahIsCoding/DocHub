const userElementsMap = new Map();
function getNewDate() {
  let newData = [];
  userElementsMap.forEach((value) => newData.push(...value));
  console.log(userElementsMap);
  return newData;
}
function handleIO(io) {
  if (!io) return;
  io.on("connection", (socket) => {
    console.log("connected", socket.id);
    socket.on("get-document", (documentId) => {
      socket.join(documentId);

      // socket.on("send-changes", (data) => {
      //   socket.broadcast.to(documentId).emit("receive-changes", data);
      // });
      socket.on("send-changes-wb", (payload) => {
        userElementsMap.set(payload.uuid, payload.elements);
        let data = getNewDate();
        io.to(documentId).emit("receive-changes-wb", data);
      });
    });
  });
}
module.exports = { handleIO };
