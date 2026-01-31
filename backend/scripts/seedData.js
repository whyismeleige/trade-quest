require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const { fakerEN_IN: faker } = require('@faker-js/faker');
const connectDB = require("../database/mongoDB");
const db = require("../models");

// Models mapping
const User = db.user;
const Stock = db.stock;
const Portfolio = db.portfolio;
const Trade = db.trade;
const League = db.league;
const LeagueEntry = db.leagueEntry;

const SEED_COUNT = 500; // Users to generate

/**
 * Procedural Indian Stock List (Nifty 50 Giants)
 */
const indianStocksRaw = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy', price: 2950.45 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology', price: 3820.15 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking', price: 1445.60 },
    { symbol: 'INFY', name: 'Infosys Ltd', sector: 'Technology', price: 1610.00 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Banking', price: 1085.25 },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', sector: 'Automobile', price: 965.80 },
    { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', price: 770.40 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecom', price: 1215.10 },
    { symbol: 'ITC', name: 'ITC Ltd', sector: 'Consumer Goods', price: 435.00 },
    { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', sector: 'Conglomerate', price: 3120.00 },
    { symbol: 'ZOMATO', name: 'Zomato Ltd', sector: 'Consumer', price: 185.30 },
    { symbol: 'AXISBANK', name: 'Axis Bank Ltd', sector: 'Banking', price: 1050.00 },
    { symbol: 'WIPRO', name: 'Wipro Ltd', sector: 'Technology', price: 480.00 },
    { symbol: 'TITAN', name: 'Titan Company Ltd', sector: 'Consumer', price: 3600.00 },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', sector: 'Automobile', price: 12500.00 },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', sector: 'Consumer Goods', price: 2400.00 },
    { symbol: 'LT', name: 'Larsen & Toubro Ltd', sector: 'Construction', price: 3500.00 },
    { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', sector: 'Consumer Goods', price: 2850.00 },
    { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd', sector: 'Automobile', price: 2050.00 },
    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', sector: 'Healthcare', price: 1550.00 }
];

const generateMockHistory = (currentPrice) => {
    const history = [];
    const now = new Date();
    let tempPrice = currentPrice;
    // Generate 100 points of history for demo sparklines
    for (let i = 0; i < 100; i++) {
        const date = new Date(now);
        date.setHours(date.getHours() - i);
        const change = 1 + (Math.random() * 0.04 - 0.02);
        tempPrice = tempPrice * change;
        history.push({ price: parseFloat(tempPrice.toFixed(2)), timestamp: date });
    }
    return history.reverse();
};

const seedEverything = async () => {
    try {
        await connectDB();
        console.log("🧹 Clearing all existing data...");
        await Promise.all([
            User.deleteMany({}), Stock.deleteMany({}), Portfolio.deleteMany({}),
            Trade.deleteMany({}), League.deleteMany({}), LeagueEntry.deleteMany({})
        ]);

        // 1. SEED STOCKS
        console.log("📈 Seeding Indian Stocks...");
        const stockDocs = indianStocksRaw.map(s => ({
            ...s,
            currentPrice: s.price,
            previousClosePrice: s.price * (0.98 + Math.random() * 0.04),
            history: generateMockHistory(s.price)
        }));
        const seededStocks = await Stock.insertMany(stockDocs);

        // 2. SEED LEAGUES
        console.log("🏆 Seeding Leagues...");
        const seededLeagues = await League.insertMany([
            { name: "Mumbai Day Traders", type: "DAILY", startDate: new Date(), endDate: new Date(Date.now() + 86400000) },
            { name: "Dalal Street Weekly", type: "WEEKLY", startDate: new Date(), endDate: new Date(Date.now() + 604800000) },
            { name: "Nifty 50 Monthly Challenge", type: "MONTHLY", startDate: new Date(), endDate: new Date(Date.now() + 2592000000) }
        ]);

        // 3. PROCEDURAL USERS & RELATIONSHIPS
        console.log(`👤 Generating ${SEED_COUNT} Users with Indian names...`);
        const userDocs = [];
        const portfolioDocs = [];
        const tradeDocs = [];
        const entryDocs = [];
        const passwordHash = await bcrypt.hash("Password@123", 12);

        for (let i = 0; i < SEED_COUNT; i++) {
            const uId = new mongoose.Types.ObjectId();
            const pId = new mongoose.Types.ObjectId();
            const fName = faker.person.firstName();
            const lName = faker.person.lastName();

            userDocs.push({
                _id: uId,
                name: `${fName} ${lName}`,
                email: faker.internet.email({ firstName: fName, lastName: lName }).toLowerCase(),
                password: passwordHash,
                portfolio: pId,
                totalPoints: faker.number.int({ min: 100, max: 20000 }),
                level: faker.number.int({ min: 1, max: 30 }),
                currentXp: faker.number.int({ min: 0, max: 999 }),
            });

            // Portfolio & Trades
            let cash = 1000000; // Start with 10 Lakhs INR
            const holdings = [];
            const tradeCount = faker.number.int({ min: 3, max: 12 });

            for (let t = 0; t < tradeCount; t++) {
                const stock = seededStocks[faker.number.int({ min: 0, max: seededStocks.length - 1 })];
                const qty = faker.number.int({ min: 10, max: 100 });
                const price = stock.currentPrice * (0.97 + Math.random() * 0.06);
                const cost = qty * price;

                if (cash >= cost) {
                    tradeDocs.push({
                        userId: uId,
                        portfolioId: pId,
                        symbol: stock.symbol,
                        type: "BUY",
                        quantity: qty,
                        price: price,
                        totalCost: cost,
                        executedAt: faker.date.past({ years: 1 })
                    });
                    cash -= cost;
                    holdings.push({ symbol: stock.symbol, quantity: qty, averagePrice: price });
                }
            }

            portfolioDocs.push({
                _id: pId,
                userId: uId,
                cashBalance: cash,
                holdings: holdings,
                totalValue: cash + (holdings.reduce((acc, h) => acc + (h.quantity * 1000), 0)) // Est.
            });

            // Random League Entry
            if (Math.random() > 0.4) {
                entryDocs.push({
                    leagueId: seededLeagues[faker.number.int({ min: 0, max: seededLeagues.length - 1 })]._id,
                    userId: uId,
                    startingValue: 1000000,
                    currentValue: 1000000 + faker.number.int({ min: -50000, max: 150000 }),
                    rank: 0
                });
            }
        }

        console.log("💾 Executing Massive Bulk Insert...");
        await Promise.all([
            User.insertMany(userDocs),
            Portfolio.insertMany(portfolioDocs),
            Trade.insertMany(tradeDocs),
            LeagueEntry.insertMany(entryDocs)
        ]);

        console.log(`✅ SUCCESS!`);
        console.log(`- ${seededStocks.length} Indian Stocks`);
        console.log(`- ${SEED_COUNT} Indian Users`);
        console.log(`- ${tradeDocs.length} Historical Trades`);
        process.exit(0);
    } catch (err) {
        console.error("❌ SEEDING FAILED:", err);
        process.exit(1);
    }
};

seedEverything();