const cron = require('node-cron');
const League = require('../models/League');

const initScheduledJobs = () => {
  // Run every day at Midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('🕛 Running Midnight League Scheduler...');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Create Daily League
    await League.create({
      name: `Daily League - ${today.toDateString()}`,
      type: 'DAILY',
      startDate: today,
      endDate: tomorrow,
      isActive: true
    });
    
    console.log('✅ Created Daily League');
  });
};

module.exports = initScheduledJobs;