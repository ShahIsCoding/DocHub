function handleConnection(setSocket, io) {
  const soc = io("http://localhost:3002", { autoConnect: false });
  if (soc.connected) console.log("CONNECTED");
  setSocket(soc);
}

export { handleConnection };
