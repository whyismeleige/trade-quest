const cron = require('node-cron');
const db = require("../models"); // Adjust path to your models folder
const League = db.league;

const initScheduledJobs = () => {
  console.log("⏰ Scheduler Initialized: Waiting for midnight...");

  // Run every day at Midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('🔄 Running Test League Maintenance...');
    
    const today = new Date();
    // Set strictly to midnight for consistent comparisons
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today); 
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
      // 1. Close Yesterday's Active Leagues
      // We explicitly close any league that should have ended by now
      await League.updateMany(
        { endDate: { $lte: today }, isActive: true }, 
        { isActive: false }
      );

      // 2. Create TODAY'S Daily League
      await League.create({
        name: `Daily Cup - ${today.toLocaleDateString('en-US')}`,
        type: 'DAILY',
        startDate: today,
        endDate: tomorrow,
        isActive: true
      });
      console.log(`✅ Created Daily League for ${today.toLocaleDateString()}`);

      // 3. Create WEEKLY League (If it is Monday)
      // 1 = Monday in JS Date.getDay()
      if (today.getDay() === 1) { 
        const nextWeek = new Date(today); 
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        await League.create({
          name: `Weekly Series - Week of ${today.toLocaleDateString('en-US')}`,
          type: 'WEEKLY',
          startDate: today,
          endDate: nextWeek,
          isActive: true
        });
        console.log(`✅ Created Weekly League starting ${today.toLocaleDateString()}`);
      }
      
      // 4. Create MONTHLY League (If it is the 1st of the month)
      if (today.getDate() === 1) {
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        await League.create({
          name: `Masters Cup - ${today.toLocaleString('default', { month: 'long' })}`,
          type: 'MONTHLY',
          startDate: today,
          endDate: nextMonth,
          isActive: true
        });
        console.log(`✅ Created Monthly League for ${today.toLocaleString('default', { month: 'long' })}`);
      }

    } catch (error) {
      console.error("❌ Scheduler Error:", error);
    }
  });
};

module.exports = initScheduledJobs;