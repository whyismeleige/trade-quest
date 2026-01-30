// socket/index.js
const { Server } = require("socket.io");
const registerUserHandlers = require("./user.socket");
const registerLeagueHandlers = require("./league.socket");
const registerMarketHandlers = require("./market.socket");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"], // Adjust if needed
      methods: ["GET", "POST"]
    },
    pingTimeout: 60000,
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Initialize all handlers
    registerUserHandlers(io, socket);
    registerLeagueHandlers(io, socket);
    registerMarketHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}

module.exports = initializeSocket;