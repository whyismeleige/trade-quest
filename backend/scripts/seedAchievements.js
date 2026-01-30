
require('dotenv').config();
const { Achievement } = require('../models/Achievement.model');
const connectDB = require("../database/mongoDB");

const achievements = [
  {
    achievementId: 'FIRST_TRADE',
    name: 'First Steps',
    description: 'Execute your very first trade',
    category: 'trading',
    rarity: 'common',
    pointsReward: 50,
    criteria: {
      type: 'TRADE_COUNT',
      target: 1,
    },
    icon: '🚀'
  },
  {
    achievementId: 'TRADER_10',
    name: 'Momentum Builder',
    description: 'Complete 10 trades',
    category: 'trading',
    rarity: 'common',
    pointsReward: 100,
    criteria: {
      type: 'TRADE_COUNT',
      target: 10,
    },
    icon: '📈'
  },
  {
    achievementId: 'DIVERSIFY_5',
    name: 'Portfolio Manager',
    description: 'Hold 5 different stocks simultaneously',
    category: 'portfolio',
    rarity: 'rare',
    pointsReward: 250,
    criteria: {
      type: 'DIVERSIFICATION',
      target: 5,
    },
    icon: '💼'
  },
  {
    achievementId: 'DAY_TRADER',
    name: 'Day Trader',
    description: 'Execute 5 trades in a single day',
    category: 'trading',
    rarity: 'rare',
    pointsReward: 200,
    criteria: {
      type: 'DAILY_TRADES',
      target: 5,
    },
    icon: '⚡'
  }
];

const seedDB = async () => {
  try {
    connectDB()
    console.log('Connected to DB');

    // Upsert achievements (Update if exists, Insert if new)
    for (const ach of achievements) {
      await Achievement.findOneAndUpdate(
        { achievementId: ach.achievementId },
        ach,
        { upsert: true, new: true }
      );
    }

    console.log('Achievements seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();