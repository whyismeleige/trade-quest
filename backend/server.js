require("dotenv").config();
const express = require("express");
const cors = require("cors");
const intializeSocket = require("./sockets");

const connectDB = require("./database/mongoDB");
const errorHandler = require("./middleware/errorHandler");

const { createServer } = require("node:http");

const app = express();

const server = createServer(app);
const io = intializeSocket(server);

const PORT = process.env.PORT || 8080;

const authRoutes = require("./routes/auth.routes");
const stocksRoutes = require("./routes/stocks.routes");

app.set("io", io);

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/stocks', stocksRoutes);

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

server.listen(PORT, () => console.log("Server running on PORT:", PORT));

module.exports = app;