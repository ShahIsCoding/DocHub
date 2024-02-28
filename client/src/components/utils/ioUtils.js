function handleConnection(setSocket, io) {
  const soc = io("http://localhost:3002");
  if (soc.connected) console.log("CONNECTED");
  setSocket(soc);
  return () => {
    soc.disconnect();
  };
}

export { handleConnection };
