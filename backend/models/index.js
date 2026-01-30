const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./User.model");
db.trade = require("./Trade.model");
db.stock = require("./Stock.model")
db.portfolio = require("./Portfolio.model");
db.league = require("./League.model");
db.leagueEntry = require("./LeagueEntry.model");

module.exports = db;