"use client"

import { useEffect, useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  ChevronRight,
  Flame,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  AreaChartComponent,
  PieChartComponent,
  GaugeChart,
} from "@/components/charts"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchPortfolio } from "@/store/slices/portfolio.slice"

// Mock data
const portfolioHistory = [
  { name: "Mon", value: 10000 },
  { name: "Tue", value: 10500 },
  { name: "Wed", value: 10200 },
  { name: "Thu", value: 11000 },
  { name: "Fri", value: 10800 },
  { name: "Sat", value: 11500 },
  { name: "Sun", value: 12000 },
]

const leaderboardData = [
  { rank: 1, name: "Sarah Chen", score: 24500, change: 12.5 },
  { rank: 2, name: "Mike Johnson", score: 21200, change: 8.3 },
  { rank: 3, name: "Alex Kumar", score: 18500, change: 5.2 },
  { rank: 4, name: "You", score: 12000, change: 20.0 },
  { rank: 5, name: "Emma Davis", score: 9500, change: -2.1 },
]

const portfolioAllocation = [
  { name: "Technology", value: 4800, color: "var(--primary)" },
  { name: "Finance", value: 3000, color: "var(--secondary)" },
  { name: "Healthcare", value: 2400, color: "var(--accent)" },
  { name: "Energy", value: 1800, color: "var(--chart-4)" },
]

const recentTrades = [
  { id: 1, symbol: "AAPL", name: "Apple Inc.", type: "BUY", price: 178.5, quantity: 10, profit: 150, time: "2m ago", change: 2.3 },
  { id: 2, symbol: "TSLA", name: "Tesla Inc.", type: "SELL", price: 242.8, quantity: 5, profit: -80, time: "15m ago", change: -1.2 },
  { id: 3, symbol: "GOOGL", name: "Alphabet Inc.", type: "BUY", price: 140.2, quantity: 8, profit: 200, time: "1h ago", change: 3.1 },
  { id: 4, symbol: "MSFT", name: "Microsoft Corp.", type: "BUY", price: 378.9, quantity: 3, profit: 85, time: "2h ago", change: 1.8 },
]

const achievements = [
  { id: 1, name: "First Trade", description: "Complete your first trade", icon: "🎯", progress: 100, unlocked: true },
  { id: 2, name: "Hot Streak", description: "Win 5 trades in a row", icon: "🔥", progress: 100, unlocked: true },
  { id: 3, name: "Risk Taker", description: "Make a trade over $5000", icon: "⚡", progress: 60, unlocked: false },
  { id: 4, name: "Diversified", description: "Own stocks in 5 sectors", icon: "🌟", progress: 80, unlocked: false },
]

const watchlist = [
  { symbol: "NVDA", name: "NVIDIA", price: 875.28, change: 4.52, changePercent: 0.52 },
  { symbol: "AMZN", name: "Amazon", price: 178.25, change: -2.15, changePercent: -1.19 },
  { symbol: "META", name: "Meta", price: 505.95, change: 8.32, changePercent: 1.67 },
]

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const [selectedPeriod, setSelectedPeriod] = useState("1W")
  const { user } = useAppSelector((state) => state.auth);
  const portfolio = useAppSelector((state) => state.portfolio);
  useEffect(() => {
    dispatch(fetchPortfolio());
  },[dispatch])
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Piyush</h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your portfolio today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="rounded-full bg-orange-500/20 p-2">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Win Streak</p>
                <p className="text-xl font-bold text-orange-500">5 Days</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="rounded-full bg-primary/20 p-2">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">League Rank</p>
                <p className="text-xl font-bold text-primary">#4</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Portfolio Value"
          value={portfolio.cashBalance}
          change="+20.0%"
          changeValue="+$2,000"
          isPositive={true}
          icon={<DollarSign className="h-4 w-4" />}
          description="All time high"
        />
        {/* <StatsCard
          title="Today's P&L"
          value="$270.00"
          change="+2.3%"
          changeValue="+$270"
          isPositive={true}
          icon={<Activity className="h-4 w-4" />}
          description="Real-time"
        /> */}
        {/* <StatsCard
          title="Total Trades"
          value="28"
          change="+3 today"
          changeValue=""
          isPositive={true}
          icon={<Target className="h-4 w-4" />}
          description="68% win rate"
        /> */}
        <StatsCard
          title="XP Points"
          value={user?.currentXp || 0}
          change="+150 today"
          changeValue=""
          isPositive={true}
          icon={<Zap className="h-4 w-4" />}
          description="Level 12"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Portfolio Performance - 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Your portfolio value over time</CardDescription>
            </div>
            <div className="flex gap-1">
              {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <AreaChartComponent
              data={portfolioHistory}
              dataKey="value"
              name="Portfolio Value"
              positiveColor="var(--accent)"
              height={280}
            />
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Portfolio distribution by sector</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChartComponent
              data={portfolioAllocation}
              type="donut"
              height={200}
              showLabels={false}
              showLegend={false}
            />
            <Separator className="my-4" />
            <div className="space-y-3">
              {portfolioAllocation.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ${item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Leaderboard */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                League Leaderboard
              </CardTitle>
              <CardDescription>Top performers this week</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboardData.map((player) => (
                <div
                  key={player.rank}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                    player.name === "You"
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold ${
                        player.rank === 1
                          ? "bg-yellow-500/20 text-yellow-500"
                          : player.rank === 2
                          ? "bg-slate-400/20 text-slate-400"
                          : player.rank === 3
                          ? "bg-orange-500/20 text-orange-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {player.rank <= 3 ? ["🥇", "🥈", "🥉"][player.rank - 1] : player.rank}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {player.name}
                        {player.name === "You" && (
                          <Badge variant="secondary" className="ml-2">
                            You
                          </Badge>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${player.score.toLocaleString()} portfolio
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        player.change >= 0 ? "text-accent" : "text-primary"
                      }`}
                    >
                      {player.change >= 0 ? "+" : ""}
                      {player.change}%
                    </p>
                    <p className="text-xs text-muted-foreground">this week</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Gauges */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Your trading statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center w-full">
              <GaugeChart
                value={68}
                label="Win Rate"
                sections={[
                  { min: 0, max: 40, color: "var(--primary)", label: "Poor" },
                  { min: 41, max: 60, color: "var(--secondary)", label: "Average" },
                  { min: 61, max: 80, color: "var(--accent)", label: "Good" },
                  { min: 81, max: 100, color: "var(--chart-4)", label: "Excellent" },
                ]}
                size={160}
              />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">19</p>
                <p className="text-xs text-muted-foreground">Winning Trades</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">9</p>
                <p className="text-xs text-muted-foreground">Losing Trades</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">$142</p>
                <p className="text-xs text-muted-foreground">Avg. Profit</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">$78</p>
                <p className="text-xs text-muted-foreground">Avg. Loss</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Trades */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>Your latest trading activity</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View History <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted font-bold">
                      {trade.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{trade.symbol}</span>
                        <Badge
                          variant={trade.type === "BUY" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {trade.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{trade.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        trade.profit >= 0 ? "text-accent" : "text-primary"
                      }`}
                    >
                      {trade.profit >= 0 ? "+" : ""}${trade.profit}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                      <Clock className="h-3 w-3" />
                      {trade.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements & Watchlist */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏆 Achievements
              </CardTitle>
              <CardDescription>Your progress milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`rounded-lg border p-3 ${
                      achievement.unlocked
                        ? "border-yellow-500/30 bg-yellow-500/5"
                        : "opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{achievement.icon}</span>
                        <span className="font-medium text-sm">{achievement.name}</span>
                      </div>
                      {achievement.unlocked && (
                        <Badge variant="secondary" className="text-xs">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    {!achievement.unlocked && (
                      <Progress value={achievement.progress} className="h-1.5" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Watchlist */}
          <Card>
            <CardHeader>
              <CardTitle>Watchlist</CardTitle>
              <CardDescription>Stocks you&apos;re tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {watchlist.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold">{stock.symbol}</p>
                      <p className="text-xs text-muted-foreground">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${stock.price}</p>
                      <p
                        className={`text-xs flex items-center justify-end gap-1 ${
                          stock.change >= 0 ? "text-accent" : "text-primary"
                        }`}
                      >
                        {stock.change >= 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {stock.change >= 0 ? "+" : ""}
                        {stock.changePercent}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatsCard({
  title,
  value,
  change,
  isPositive,
  icon,
  description,
}: {
  title: string
  value: string | number
  change: string
  changeValue: string
  isPositive: boolean
  icon: React.ReactNode
  description: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={`rounded-lg p-2 ${
            isPositive ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
          }`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-1">
          <span
            className={`text-sm font-medium flex items-center gap-1 ${
              isPositive ? "text-accent" : "text-primary"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {change}
          </span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}
