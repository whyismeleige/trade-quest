const { Server } = require("socket.io");

const UserSocket = require("./user.socket");

function intializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"],
    },
    maxHttpBufferSize: 5 * 1024 * 1024,
    pingTimeout: 60000,
  });

  io.on("connection", (socket) => {
    UserSocket(io, socket);
  });

  return io;
}

module.exports = intializeSocket;