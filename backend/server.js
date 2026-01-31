require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { createServer } = require("node:http");

// ⚠️ CHANGE THIS PATH: If your folder is named 'socket' (singular), use "./socket"
const initializeSocket = require("./sockets"); 

const connectDB = require("./database/mongoDB");
const errorHandler = require("./middleware/errorHandler");
const initScheduledJobs = require("./jobs/leagueScheduler");

// 1. IMPORT THE SIMULATOR
const MarketSimulator = require("./services/simulator.service");

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 8080;

// 2. MIDDLEWARE
app.use(
  cors({
    origin: [
      "https://trade-quest.piyushbuilds.me",
      "https://trade-quest-umber.vercel.app", 
      "http://localhost:3000"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. INITIALIZE SOCKETS
// We do this BEFORE routes so we can attach 'io' to the app if needed
const io = initializeSocket(server);
app.set("io", io); 

// 4. ROUTES
const authRoutes = require("./routes/auth.routes");
const stocksRoutes = require("./routes/stocks.routes");
const tradeRoutes = require("./routes/trade.routes");
const leagueRoutes = require("./routes/league.routes");
const portfolioRoutes = require("./routes/portfolio.routes");
const achievementRoutes = require("./routes/achievement.routes");

app.use("/api/auth", authRoutes);
app.use("/api/stocks", stocksRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/leagues", leagueRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/achievements", achievementRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Code Sprint API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    type: "error",
    data: null,
  });
});

// Global Error Handler
app.use(errorHandler);

// ==========================================
// 🚀 SERVER STARTUP SEQUENCE
// ==========================================
const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();
    console.log("✅ Database connected successfully");

    // 2. Start Scheduled Jobs (Cron)
    initScheduledJobs();

    // 3. START MARKET SIMULATOR
    // Pass 'io' so the simulator can broadcast updates
    const simulator = new MarketSimulator(io);
    await simulator.init(); 
    
    // 4. Start Listening
    server.listen(PORT, () => {
      console.log(`✅ Server running on PORT: ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;