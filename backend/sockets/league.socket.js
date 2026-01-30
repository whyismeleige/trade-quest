// socket/league.socket.js
module.exports = (io, socket) => {
  // Frontend sends: socket.emit("join-league", "league_id_123")
  socket.on("join-league", (leagueId) => {
    console.log(`Socket ${socket.id} joined league room: ${leagueId}`);
    socket.join(`league-${leagueId}`);
  });

  socket.on("leave-league", (leagueId) => {
    socket.leave(`league-${leagueId}`);
  });
};