require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const intializeSocket = require("./sockets");
const { createServer } = require("node:http");

const connectDB = require("./database/mongoDB");
const errorHandler = require("./middleware/errorHandler");
const initScheduledJobs = require("./jobs/leagueScheduler");

// 1. IMPORT THE SIMULATOR
const MarketSimulator = require("./services/simulator.service");

const app = express();
const server = createServer(app);

// 2. INITIALIZE SOCKETS
const io = intializeSocket(server);
app.set("io", io); // Make io accessible in controllers

const PORT = process.env.PORT || 8080;

// Routes
const authRoutes = require("./routes/auth.routes");
const stocksRoutes = require("./routes/stocks.routes");
const tradeRoutes = require("./routes/trade.routes");
const leagueRoutes = require("./routes/league.routes");
const portfolioRoutes = require("./routes/portfolio.routes");
const achievementRoutes = require("./routes/achievement.routes");

app.use(
  cors({
    origin: ["https://trade-quest.piyushbuilds.me","https://trade-quest-umber.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
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

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    type: "error",
    data: null,
  });
});

app.use(errorHandler);

// ==========================================
// 🚀 SERVER STARTUP SEQUENCE
// ==========================================
const startServer = async () => {
  try {
    // 1. Connect to Database (Await it to ensure connection exists)
    await connectDB();
    console.log("✅ Database connected successfully");

    // 2. Start Scheduled Jobs (Cron)
    initScheduledJobs();

    // 3. START MARKET SIMULATOR
    // We pass 'io' so it can emit price updates
    const simulator = new MarketSimulator(io);
    await simulator.init(); 
    console.log("✅ Market Simulator started");

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