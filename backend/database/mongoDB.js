require("dotenv").config();
const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const db = require("../models");

// Database Connection
const connectDB = () => {
  db.mongoose
    .connect(url, { dbName })
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((err) => console.log("Connection Error", err));
};

module.exports = connectDB;