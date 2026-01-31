const { Server } = require("socket.io");
const registerUserHandlers = require("./user.socket");
const registerLeagueHandlers = require("./league.socket");
const registerMarketHandlers = require("./market.socket");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      // ⚠️ IMPORTANT: Add all your frontend URLs here
      origin: [
        "https://trade-quest.piyushbuilds.me",
        "https://trade-quest-umber.vercel.app", 
        "http://localhost:3000"
      ],
      methods: ["GET", "POST"],
      credentials: true
    },
    // 60s timeout helps keep connections alive on slower networks
    pingTimeout: 60000, 
    transports: ['websocket', 'polling'] 
  });

  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    // Initialize all handlers
    // Ensure user.socket.js and league.socket.js exist, or comment these out temporarily
    if (typeof registerUserHandlers === 'function') registerUserHandlers(io, socket);
    if (typeof registerLeagueHandlers === 'function') registerLeagueHandlers(io, socket);
    
    // ✅ This connects the logic for the Simulator subscribers
    registerMarketHandlers(io, socket);

    socket.on("disconnect", () => {
      // console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}

module.exports = initializeSocket;