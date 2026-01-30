// Example: Integrating Charts with TradeQuest Redux State

import { useSelector } from "react-redux"
import {
  CandlestickChart,
  LineChartComponent,
  LeaderboardChart,
  GaugeChart,
} from "@/components/charts"

/**
 * Example 1: Portfolio Performance Dashboard
 * Shows user's portfolio value over time
 */
export function PortfolioChart() {
  const portfolioHistory = useSelector((state: any) => state.portfolio.history)

  const chartData = portfolioHistory.map((entry: any) => ({
    name: new Date(entry.timestamp).toLocaleDateString(),
    value: entry.totalValue,
  }))

  return (
    <LineChartComponent
      data={chartData}
      dataKey="value"
      name="Portfolio Value"
      yAxisLabel="Value ($)"
    />
  )
}

/**
 * Example 2: Trading Activity - Candlestick Chart
 * Shows real-time OHLC data for a selected stock
 */
export function StockPriceChart({ symbol }: { symbol: string }) {
  const priceData = useSelector((state: any) => state.trades.ohlcData[symbol])

  if (!priceData) return <div>Loading price data...</div>

  return <CandlestickChart data={priceData} height={450} />
}

/**
 * Example 3: Global Leaderboard
 * Shows top 10 students ranked by portfolio value
 */
export function GlobalLeaderboard() {
  const leaderboard = useSelector((state: any) => state.leaderboard.topStudents)

  const formattedData = leaderboard.map((student: any) => ({
    rank: student.position,
    name: student.username,
    score: student.portfolioValue,
    change: student.weeklyChange,
  }))

  return <LeaderboardChart data={formattedData} maxEntries={10} />
}

/**
 * Example 4: User Achievement Progress
 * Shows progress towards various trading achievements
 */
export function AchievementProgress() {
  const user = useSelector((state: any) => state.auth.user)

  return (
    <div className="grid grid-cols-4 gap-6">
      <GaugeChart
        value={user.achievements.tradesCompleted}
        label="Trades"
        max={100}
      />
      <GaugeChart
        value={user.achievements.winRate}
        label="Win Rate"
        max={100}
        sections={[
          { min: 0, max: 40, color: "#ef4444", label: "Low" },
          { min: 41, max: 70, color: "#f59e0b", label: "Medium" },
          { min: 71, max: 100, color: "#10b981", label: "High" },
        ]}
      />
      <GaugeChart
        value={user.achievements.streakDays}
        label="Days Active"
        max={365}
      />
      <GaugeChart
        value={user.portfolio.healthScore}
        label="Portfolio Health"
        max={100}
      />
    </div>
  )
}

/**
 * Example 5: WebSocket Integration for Real-Time Updates
 * Connect Recharts to your Socket.io for live data
 */
import { useSocket } from "@/hooks/useSocket"
import { useEffect, useState } from "react"

export function LiveTradeChart({ userId }: { userId: string }) {
  const socketData = useSocket()
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (!socketData?.socket) return

    const socket = socketData.socket

    // Listen for price updates
    socket.on(`portfolio:${userId}`, (data: any) => {
      setChartData((prev) => [
        ...prev,
        {
          name: new Date(data.timestamp).toLocaleTimeString(),
          value: data.currentValue,
        },
      ])
    })

    return () => {
      socket.off(`portfolio:${userId}`)
    }
  }, [socketData, userId])

  return (
    <LineChartComponent
      data={chartData.slice(-20)} // Show last 20 entries
      dataKey="value"
      name="Live Portfolio"
      stroke="#10b981"
    />
  )
}

/**
 * Example 6: Portfolio Allocation
 * Show user's current asset allocation
 */
import { PieChartComponent } from "@/components/charts"

export function PortfolioAllocation() {
  const holdings = useSelector((state: any) => state.portfolio.holdings)

  const chartData = holdings.map((holding: any) => ({
    name: holding.sector,
    value: holding.value,
  }))

  return <PieChartComponent data={chartData} type="donut" />
}

/**
 * Example 7: Student Comparison - Radar Chart
 * Compare performance metrics between multiple students
 */
import { RadarChartComponent } from "@/components/charts"

export function StudentComparison({ studentIds }: { studentIds: string[] }) {
  const students = useSelector((state: any) => state.students.byId)

  const radarData = [
    "Risk Management",
    "Timing",
    "Diversification",
    "Profit Growth",
    "Trade Accuracy",
  ].map((category) => {
    const dataPoint: any = { category }
    studentIds.forEach((id) => {
      dataPoint[`student${id}`] = students[id]?.metrics?.[category] || 0
    })
    return dataPoint
  })

  const multipleRadars = studentIds.slice(1).map((id, idx) => ({
    dataKey: `student${id}`,
    stroke: ["#10b981", "#f59e0b", "#ec4899"][idx],
    fill: ["#10b981", "#f59e0b", "#ec4899"][idx],
    name: students[id]?.username || `Student ${id}`,
  }))

  return (
    <RadarChartComponent
      data={radarData}
      dataKey={`student${studentIds[0]}`}
      name={students[studentIds[0]].username}
      multipleRadars={multipleRadars}
    />
  )
}

/**
 * Example 8: Trading Heatmap
 * Show stock performance across time periods
 */
import { HeatmapChart } from "@/components/charts"

export function TradingActivityHeatmap() {
  const tradingActivity = useSelector((state: any) => state.trades.heatmapData)

  return (
    <HeatmapChart
      data={tradingActivity}
      title="Trading Activity by Stock & Time"
      colorScheme="trading"
    />
  )
}

/**
 * Example 9: Performance Bar Chart
 * Compare daily profit/loss
 */
import { BarChartComponent } from "@/components/charts"

export function DailyPerformanceChart() {
  const dailyMetrics = useSelector((state: any) => state.portfolio.dailyMetrics)

  const chartData = dailyMetrics.map((day: any) => ({
    name: new Date(day.date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    value: day.profitLoss,
  }))

  return (
    <BarChartComponent
      data={chartData}
      dataKey="value"
      name="Daily Profit/Loss"
      showColors={true}
      layout="vertical"
    />
  )
}

/**
 * Example 10: Area Chart with Portfolio Growth
 * Show growth trajectory
 */
import { AreaChartComponent } from "@/components/charts"

export function GrowthTrendChart() {
  const portfolioGrowth = useSelector((state: any) => state.portfolio.growth)

  return (
    <AreaChartComponent
      data={portfolioGrowth}
      dataKey="value"
      name="Portfolio Growth"
      positiveColor="#10b981"
      negativeColor="#ef4444"
    />
  )
}

/**
 * Redux State Structure Example
 * This is the recommended structure for maximum chart compatibility
 */

/*
store/slices/portfolio.slice.ts

const portfolioSlice = {
  history: [
    { timestamp: "2026-01-30T09:00:00", totalValue: 10000 },
    { timestamp: "2026-01-30T10:00:00", totalValue: 10500 },
    ...
  ],
  
  holdings: [
    { sector: "Technology", value: 3500 },
    { sector: "Healthcare", value: 2200 },
    ...
  ],
  
  dailyMetrics: [
    { date: "2026-01-30", profitLoss: 500 },
    { date: "2026-01-31", profitLoss: -300 },
    ...
  ],
  
  growth: [
    { name: "Week 1", value: 5000 },
    { name: "Week 2", value: 5800 },
    ...
  ]
}

store/slices/trades.slice.ts

const tradesSlice = {
  ohlcData: {
    "AAPL": [
      { time: "9:30", open: 150.5, high: 155.2, low: 149.8, close: 153.4 },
      ...
    ],
    "GOOGL": [...]
  },
  
  heatmapData: [
    { x: "AAPL", y: "9:30", value: 2.5 },
    ...
  ]
}

store/slices/leaderboard.slice.ts

const leaderboardSlice = {
  topStudents: [
    { position: 1, username: "Alice", portfolioValue: 45230, weeklyChange: 5.2 },
    ...
  ]
}
*/
