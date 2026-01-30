// sockets/tradeSocket.js
const jwt = require('jsonwebtoken');
const tradeService = require('../services/tradeService');
const Stock = require('../models/Stock.model');

/**
 * Initialize Socket.io Logic
 * @param {Object} io - Socket.io instance
 */
module.exports = (io) => {
  // Middleware: Authenticate Socket Connection
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // JOIN ROOM: Client wants price updates for specific stock
    socket.on('join_stock', (symbol) => {
      socket.join(`stock_${symbol}`);
      console.log(`User ${socket.userId} joined stock_${symbol}`);
    });

    // PLACE ORDER: Client wants to buy/sell
    socket.on('place_order', async (data) => {
      // data = { symbol: 'AAPL', type: 'BUY', quantity: 10 }
      try {
        const { symbol, type, quantity } = data;
        
        // Call the service (defined in Step 1)
        const result = await tradeService.executeTrade(
          socket.userId, 
          symbol, 
          type, 
          parseInt(quantity)
        );

        // 1. Notify User: Success
        socket.emit('trade_success', {
          message: `${type} order executed for ${symbol}`,
          trade: result.trade
        });

        // 2. Notify User: Update their Portfolio UI immediately
        socket.emit('portfolio_update', result.portfolio);

      } catch (error) {
        socket.emit('trade_error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};