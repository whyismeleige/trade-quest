// socket/market.socket.js
module.exports = (io, socket) => {
  // Join the global market room to receive price ticks
  socket.on("subscribe-market", () => {
    socket.join("market-data");
  });

  socket.on("unsubscribe-market", () => {
    socket.leave("market-data");
  });
};