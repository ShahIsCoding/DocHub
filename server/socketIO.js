function handleIO(io) {
  if (!io) return;
  let elementMap = new Map();
  let blockedId = new Set();
  io.on("connection", (socket) => {
    console.log("connected", socket.id);
    socket.on("join-document", (documentId) => {
      socket.join(documentId);
      socket.on("block-whiteboard-elementId", (payload) => {
        let { data: element } = payload;
        let elementId = element.id;
        if (!blockedId.has(elementId)) {
          blockedId.add(elementId);
          socket.broadcast.emit("block-whiteboard-elementId", blockedId);
        }
      });
      socket.on("unblock-whiteboard-elementId", (payload) => {
        let { data: element } = payload;
        let elementId = element?.id;
        if (blockedId.has(elementId)) {
          blockedId.delete(elementId);
          socket.broadcast.emit("unblock-whiteboard-elementId", elementId);
        }
      });
      socket.on("updated-whiteboard-data", (payload) => {
        elementMap.set(payload.userId, payload.data);
        console.log("sending data");

        let elementMapObject = {};
        elementMap.forEach((value, key) => {
          elementMapObject[key] = value;
        });

        let newpayload = {
          keys: Array.from(elementMap.keys()),
          elementMap: elementMapObject,
        };

        socket.broadcast.emit("updated-whiteboard-data", newpayload);
      });
    });
  });
}
module.exports = { handleIO };
