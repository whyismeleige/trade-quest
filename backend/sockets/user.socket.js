module.exports = (io, socket) => {
  socket.on("register-user", (userId) => {
    socket.join(`user-${userId.toString()}`);
  });

  socket.on("deregister-user", (userId) => {
    socket.leave(`user-${userId.toString()}`);
  });
};