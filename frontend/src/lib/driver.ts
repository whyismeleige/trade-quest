import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const initializeGuide = (userName: string) => {
  return driver({
    showProgress: true,
    animate: true,
    popoverClass: 'driverjs-theme', // Our custom class
    stagePadding: 5,
    overlayColor: "#020617", // Deep slate overlay
    overlayOpacity: 0.85,
    steps: [
      {
        element: "#nav-main",
        popover: {
          title: `🚀 Welcome, ${userName}!`,
          description: "This is your mission control. Navigate between the trading floor, your personal vault, and global rankings.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#stats-grid",
        popover: {
          title: "💎 Real-time Wealth",
          description: "Monitor your liquid assets and XP growth. Watch these numbers climb as you master the markets!",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#performance-chart",
        popover: {
          title: "📊 Visualizing Success",
          description: "Analyze your growth trajectory with our interactive performance metrics.",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#league-rank-card",
        popover: {
          title: "🏆 Road to Glory",
          description: "You're currently in the Top 5! Keep trading to secure your spot in the Hall of Fame.",
          side: "left",
          align: "center",
        },
      },
    ],
  });
};