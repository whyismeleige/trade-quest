"use client"

import { useState } from "react"
import {
  Trophy,
  Crown,
  Flame,
  Target,
  Zap,
  Star,
  ChevronUp,
  ChevronDown,
  Minus,
  Search,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs,  TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// Mock leaderboard data for different time periods
const leaderboardData = {
  daily: [
    { rank: 1, name: "Alex Thunder", username: "@alexthunder", avatar: "", portfolioValue: 15420.50, change: 8.45, winRate: 85, trades: 12, streak: 5, xp: 450, badge: "🔥" },
    { rank: 2, name: "Sarah Chen", username: "@sarahc", avatar: "", portfolioValue: 14890.20, change: 7.23, winRate: 82, trades: 15, streak: 4, xp: 380, badge: "⚡" },
    { rank: 3, name: "Mike Johnson", username: "@mikej", avatar: "", portfolioValue: 14250.80, change: 6.12, winRate: 78, trades: 10, streak: 3, xp: 320, badge: "🎯" },
    { rank: 4, name: "You", username: "@trader", avatar: "", portfolioValue: 13800.00, change: 5.50, winRate: 75, trades: 8, streak: 2, xp: 280, badge: "⭐", isCurrentUser: true },
    { rank: 5, name: "Emma Davis", username: "@emmad", avatar: "", portfolioValue: 13450.30, change: 4.89, winRate: 72, trades: 11, streak: 2, xp: 250 },
    { rank: 6, name: "James Wilson", username: "@jamesw", avatar: "", portfolioValue: 13100.75, change: 4.21, winRate: 70, trades: 9, streak: 1, xp: 220 },
    { rank: 7, name: "Lisa Park", username: "@lisap", avatar: "", portfolioValue: 12800.40, change: 3.78, winRate: 68, trades: 7, streak: 1, xp: 190 },
    { rank: 8, name: "David Kim", username: "@davidk", avatar: "", portfolioValue: 12500.90, change: 3.25, winRate: 65, trades: 6, streak: 0, xp: 160 },
    { rank: 9, name: "Anna Smith", username: "@annas", avatar: "", portfolioValue: 12200.15, change: 2.90, winRate: 63, trades: 8, streak: 0, xp: 140 },
    { rank: 10, name: "Tom Brown", username: "@tomb", avatar: "", portfolioValue: 11900.60, change: 2.45, winRate: 60, trades: 5, streak: 0, xp: 120 },
  ],
  weekly: [
    { rank: 1, name: "Sarah Chen", username: "@sarahc", avatar: "", portfolioValue: 24500.00, change: 22.50, winRate: 88, trades: 45, streak: 7, xp: 2450, badge: "👑" },
    { rank: 2, name: "Mike Johnson", username: "@mikej", avatar: "", portfolioValue: 21200.00, change: 18.30, winRate: 84, trades: 52, streak: 6, xp: 2100, badge: "🔥" },
    { rank: 3, name: "Alex Thunder", username: "@alexthunder", avatar: "", portfolioValue: 18500.00, change: 15.20, winRate: 80, trades: 38, streak: 5, xp: 1850, badge: "⚡" },
    { rank: 4, name: "You", username: "@trader", avatar: "", portfolioValue: 15800.00, change: 12.00, winRate: 76, trades: 28, streak: 4, xp: 1580, badge: "🎯", isCurrentUser: true },
    { rank: 5, name: "Emma Davis", username: "@emmad", avatar: "", portfolioValue: 14200.50, change: 10.50, winRate: 73, trades: 35, streak: 3, xp: 1420 },
    { rank: 6, name: "Lisa Park", username: "@lisap", avatar: "", portfolioValue: 13500.80, change: 9.20, winRate: 71, trades: 30, streak: 3, xp: 1350 },
    { rank: 7, name: "James Wilson", username: "@jamesw", avatar: "", portfolioValue: 12800.30, change: 8.10, winRate: 68, trades: 25, streak: 2, xp: 1280 },
    { rank: 8, name: "David Kim", username: "@davidk", avatar: "", portfolioValue: 12100.90, change: 7.00, winRate: 65, trades: 22, streak: 2, xp: 1210 },
    { rank: 9, name: "Tom Brown", username: "@tomb", avatar: "", portfolioValue: 11500.45, change: 5.80, winRate: 62, trades: 18, streak: 1, xp: 1150 },
    { rank: 10, name: "Anna Smith", username: "@annas", avatar: "", portfolioValue: 10900.20, change: 4.50, winRate: 58, trades: 20, streak: 0, xp: 1090 },
  ],
  monthly: [
    { rank: 1, name: "Mike Johnson", username: "@mikej", avatar: "", portfolioValue: 52000.00, change: 45.20, winRate: 92, trades: 180, streak: 15, xp: 12500, badge: "👑" },
    { rank: 2, name: "Sarah Chen", username: "@sarahc", avatar: "", portfolioValue: 48500.00, change: 38.50, winRate: 89, trades: 165, streak: 12, xp: 11200, badge: "🏆" },
    { rank: 3, name: "You", username: "@trader", avatar: "", portfolioValue: 42000.00, change: 32.00, winRate: 85, trades: 120, streak: 10, xp: 9800, badge: "🔥", isCurrentUser: true },
    { rank: 4, name: "Alex Thunder", username: "@alexthunder", avatar: "", portfolioValue: 38500.00, change: 28.30, winRate: 82, trades: 140, streak: 8, xp: 8500 },
    { rank: 5, name: "Lisa Park", username: "@lisap", avatar: "", portfolioValue: 35200.80, change: 24.50, winRate: 79, trades: 110, streak: 6, xp: 7800 },
    { rank: 6, name: "Emma Davis", username: "@emmad", avatar: "", portfolioValue: 32100.50, change: 21.20, winRate: 76, trades: 95, streak: 5, xp: 7100 },
    { rank: 7, name: "James Wilson", username: "@jamesw", avatar: "", portfolioValue: 29800.30, change: 18.80, winRate: 73, trades: 88, streak: 4, xp: 6500 },
    { rank: 8, name: "David Kim", username: "@davidk", avatar: "", portfolioValue: 27500.90, change: 15.50, winRate: 70, trades: 75, streak: 3, xp: 5900 },
    { rank: 9, name: "Tom Brown", username: "@tomb", avatar: "", portfolioValue: 25200.45, change: 12.30, winRate: 67, trades: 68, streak: 2, xp: 5300 },
    { rank: 10, name: "Anna Smith", username: "@annas", avatar: "", portfolioValue: 23100.20, change: 9.80, winRate: 64, trades: 55, streak: 1, xp: 4800 },
  ],
  allTime: [
    { rank: 1, name: "Trading Legend", username: "@legend", avatar: "", portfolioValue: 285000.00, change: 185.00, winRate: 94, trades: 2450, streak: 45, xp: 125000, badge: "👑", level: 50 },
    { rank: 2, name: "Mike Johnson", username: "@mikej", avatar: "", portfolioValue: 245000.00, change: 145.00, winRate: 91, trades: 2100, streak: 38, xp: 98000, badge: "🏆", level: 45 },
    { rank: 3, name: "Sarah Chen", username: "@sarahc", avatar: "", portfolioValue: 198000.00, change: 98.00, winRate: 88, trades: 1850, streak: 32, xp: 82000, badge: "💎", level: 42 },
    { rank: 4, name: "Wall Street Wolf", username: "@wswolf", avatar: "", portfolioValue: 175000.00, change: 75.00, winRate: 86, trades: 1650, streak: 28, xp: 72000, level: 38 },
    { rank: 5, name: "Alex Thunder", username: "@alexthunder", avatar: "", portfolioValue: 152000.00, change: 52.00, winRate: 84, trades: 1420, streak: 24, xp: 65000, level: 35 },
    { rank: 6, name: "Crypto King", username: "@cryptoking", avatar: "", portfolioValue: 138000.00, change: 38.00, winRate: 82, trades: 1280, streak: 20, xp: 58000, level: 32 },
    { rank: 7, name: "Lisa Park", username: "@lisap", avatar: "", portfolioValue: 125000.80, change: 25.00, winRate: 80, trades: 1150, streak: 18, xp: 52000, level: 30 },
    { rank: 8, name: "Bull Runner", username: "@bullrunner", avatar: "", portfolioValue: 112000.30, change: 12.00, winRate: 78, trades: 980, streak: 15, xp: 46000, level: 28 },
    { rank: 9, name: "You", username: "@trader", avatar: "", portfolioValue: 98500.00, change: -1.50, winRate: 76, trades: 850, streak: 12, xp: 42000, badge: "⭐", level: 25, isCurrentUser: true },
    { rank: 10, name: "Day Trader Pro", username: "@dtpro", avatar: "", portfolioValue: 89000.20, change: -5.20, winRate: 74, trades: 720, streak: 10, xp: 38000, level: 23 },
  ],
}

// Your stats for comparison
const yourStats = {
  daily: { rank: 4, previousRank: 6, portfolioValue: 13800.00, change: 5.50 },
  weekly: { rank: 4, previousRank: 5, portfolioValue: 15800.00, change: 12.00 },
  monthly: { rank: 3, previousRank: 4, portfolioValue: 42000.00, change: 32.00 },
  allTime: { rank: 9, previousRank: 8, portfolioValue: 98500.00, change: -1.50 },
}

type TimePeriod = "daily" | "weekly" | "monthly" | "allTime"

export default function LeaderboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("weekly")
  const [searchQuery, setSearchQuery] = useState("")

  const currentLeaderboard = leaderboardData[selectedPeriod]
  const currentUserStats = yourStats[selectedPeriod]

  const filteredLeaderboard = currentLeaderboard.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRankChange = (current: number, previous: number) => {
    const diff = previous - current
    if (diff > 0) return { direction: "up", value: diff }
    if (diff < 0) return { direction: "down", value: Math.abs(diff) }
    return { direction: "same", value: 0 }
  }

  const rankChange = getRankChange(currentUserStats.rank, currentUserStats.previousRank)

  const getPeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case "daily": return "Today"
      case "weekly": return "This Week"
      case "monthly": return "This Month"
      case "allTime": return "All Time"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Compete with traders worldwide and climb the ranks
          </p>
        </div>
      </div>

      {/* Your Position Card */}
      <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">Y</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-bold">
                  #{currentUserStats.rank}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Your Position</h2>
                  <Badge variant="secondary" className="text-xs">
                    {getPeriodLabel(selectedPeriod)}
                  </Badge>
                </div>
                <p className="text-muted-foreground">Keep trading to climb higher!</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:flex sm:items-center sm:gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  {rankChange.direction === "up" && (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                  )}
                  {rankChange.direction === "down" && (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  )}
                  {rankChange.direction === "same" && (
                    <Minus className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  )}
                  <span className={`text-lg sm:text-2xl font-bold ${
                    rankChange.direction === "up" ? "text-accent" :
                    rankChange.direction === "down" ? "text-primary" :
                    "text-muted-foreground"
                  }`}>
                    {rankChange.value > 0 ? rankChange.value : "-"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Rank Change</p>
              </div>
              <Separator orientation="vertical" className="h-12 hidden sm:block" />
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-bold">${currentUserStats.portfolioValue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Portfolio Value</p>
              </div>
              <Separator orientation="vertical" className="h-12 hidden sm:block" />
              <div className="text-center">
                <p className={`text-lg sm:text-2xl font-bold ${currentUserStats.change >= 0 ? "text-accent" : "text-primary"}`}>
                  {currentUserStats.change >= 0 ? "+" : ""}{currentUserStats.change.toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground">Return</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Period Tabs & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as TimePeriod)}>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="allTime">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-[250px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search traders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Second Place */}
        <Card className="order-1 md:order-1 bg-gradient-to-b from-slate-400/10 to-transparent border-slate-400/30">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="h-20 w-20 border-4 border-slate-400">
                <AvatarImage src={filteredLeaderboard[1]?.avatar} />
                <AvatarFallback className="bg-slate-400/20 text-slate-600 dark:text-slate-300 text-2xl font-bold">
                  {filteredLeaderboard[1]?.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 text-3xl">🥈</div>
            </div>
            <h3 className="font-bold text-lg">{filteredLeaderboard[1]?.name}</h3>
            <p className="text-sm text-muted-foreground">{filteredLeaderboard[1]?.username}</p>
            <div className="mt-4 space-y-2">
              <p className="text-2xl font-bold">${filteredLeaderboard[1]?.portfolioValue.toLocaleString()}</p>
              <Badge className="bg-accent/20 text-accent">
                +{filteredLeaderboard[1]?.change.toFixed(2)}%
              </Badge>
            </div>
            <div className="mt-4 flex justify-center gap-4 text-sm">
              <div>
                <p className="font-semibold">{filteredLeaderboard[1]?.winRate}%</p>
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </div>
              <div>
                <p className="font-semibold">{filteredLeaderboard[1]?.trades}</p>
                <p className="text-xs text-muted-foreground">Trades</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* First Place */}
        <Card className="order-0 md:order-2 bg-gradient-to-b from-yellow-500/20 to-transparent border-yellow-500/30 md:-mt-4">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="h-24 w-24 border-4 border-yellow-500">
                <AvatarImage src={filteredLeaderboard[0]?.avatar} />
                <AvatarFallback className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-3xl font-bold">
                  {filteredLeaderboard[0]?.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-3 -right-3 text-4xl">👑</div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className="font-bold text-xl">{filteredLeaderboard[0]?.name}</h3>
              {filteredLeaderboard[0]?.badge && (
                <span className="text-xl">{filteredLeaderboard[0]?.badge}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{filteredLeaderboard[0]?.username}</p>
            <div className="mt-4 space-y-2">
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                ${filteredLeaderboard[0]?.portfolioValue.toLocaleString()}
              </p>
              <Badge className="bg-accent/20 text-accent">
                +{filteredLeaderboard[0]?.change.toFixed(2)}%
              </Badge>
            </div>
            <div className="mt-4 flex justify-center gap-6 text-sm">
              <div>
                <p className="font-semibold text-lg">{filteredLeaderboard[0]?.winRate}%</p>
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </div>
              <div>
                <p className="font-semibold text-lg">{filteredLeaderboard[0]?.streak}</p>
                <p className="text-xs text-muted-foreground">🔥 Streak</p>
              </div>
              <div>
                <p className="font-semibold text-lg">{filteredLeaderboard[0]?.trades}</p>
                <p className="text-xs text-muted-foreground">Trades</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third Place */}
        <Card className="order-2 md:order-3 bg-gradient-to-b from-orange-500/10 to-transparent border-orange-500/30">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="h-20 w-20 border-4 border-orange-500">
                <AvatarImage src={filteredLeaderboard[2]?.avatar} />
                <AvatarFallback className="bg-orange-500/20 text-orange-600 dark:text-orange-400 text-2xl font-bold">
                  {filteredLeaderboard[2]?.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 text-3xl">🥉</div>
            </div>
            <h3 className="font-bold text-lg">{filteredLeaderboard[2]?.name}</h3>
            <p className="text-sm text-muted-foreground">{filteredLeaderboard[2]?.username}</p>
            <div className="mt-4 space-y-2">
              <p className="text-2xl font-bold">${filteredLeaderboard[2]?.portfolioValue.toLocaleString()}</p>
              <Badge className="bg-accent/20 text-accent">
                +{filteredLeaderboard[2]?.change.toFixed(2)}%
              </Badge>
            </div>
            <div className="mt-4 flex justify-center gap-4 text-sm">
              <div>
                <p className="font-semibold">{filteredLeaderboard[2]?.winRate}%</p>
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </div>
              <div>
                <p className="font-semibold">{filteredLeaderboard[2]?.trades}</p>
                <p className="text-xs text-muted-foreground">Trades</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
          <CardDescription>Full leaderboard for {getPeriodLabel(selectedPeriod).toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredLeaderboard.map((player) => (
              <div
                key={player.username}
                className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                  player.isCurrentUser
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold ${
                      player.rank === 1
                        ? "bg-yellow-500/20 text-yellow-500"
                        : player.rank === 2
                        ? "bg-slate-400/20 text-slate-500"
                        : player.rank === 3
                        ? "bg-orange-500/20 text-orange-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {player.rank <= 3 ? ["🥇", "🥈", "🥉"][player.rank - 1] : player.rank}
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={player.avatar} />
                      <AvatarFallback className="bg-muted text-sm font-medium">
                        {player.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{player.name}</p>
                        {player.badge && <span>{player.badge}</span>}
                        {player.isCurrentUser && (
                          <Badge variant="secondary" className="text-xs">You</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{player.username}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  {/* Win Streak */}
                  {player.streak > 0 && (
                    <div className="hidden md:flex items-center gap-1 text-orange-500">
                      <Flame className="h-4 w-4" />
                      <span className="text-sm font-medium">{player.streak}</span>
                    </div>
                  )}

                  {/* Win Rate */}
                  <div className="hidden sm:block text-center min-w-[60px]">
                    <p className="font-medium">{player.winRate}%</p>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                  </div>

                  {/* Trades */}
                  <div className="hidden lg:block text-center min-w-[50px]">
                    <p className="font-medium">{player.trades}</p>
                    <p className="text-xs text-muted-foreground">Trades</p>
                  </div>

                  {/* XP */}
                  <div className="hidden md:block text-center min-w-[60px]">
                    <div className="flex items-center gap-1 justify-center">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      <p className="font-medium">{player.xp.toLocaleString()}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">XP</p>
                  </div>

                  {/* Portfolio Value */}
                  <div className="text-right min-w-[100px]">
                    <p className="font-bold">${player.portfolioValue.toLocaleString()}</p>
                    <p
                      className={`text-sm ${
                        player.change >= 0 ? "text-accent" : "text-primary"
                      }`}
                    >
                      {player.change >= 0 ? "+" : ""}{player.change.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLeaderboard.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Trophy className="h-12 w-12 mb-4 opacity-50" />
              <p className="font-medium">No traders found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-yellow-500/10 p-3">
                <Crown className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Performer</p>
                <p className="font-bold">{filteredLeaderboard[0]?.name}</p>
                <p className="text-sm text-accent">+{filteredLeaderboard[0]?.change.toFixed(2)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-orange-500/10 p-3">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
                <p className="font-bold">
                  {filteredLeaderboard.reduce((max, p) => p.streak > max.streak ? p : max, filteredLeaderboard[0])?.name}
                </p>
                <p className="text-sm text-orange-500">
                  {Math.max(...filteredLeaderboard.map(p => p.streak))} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-accent/10 p-3">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Highest Win Rate</p>
                <p className="font-bold">
                  {filteredLeaderboard.reduce((max, p) => p.winRate > max.winRate ? p : max, filteredLeaderboard[0])?.name}
                </p>
                <p className="text-sm text-accent">
                  {Math.max(...filteredLeaderboard.map(p => p.winRate))}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-purple-500/10 p-3">
                <Star className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Most Active</p>
                <p className="font-bold">
                  {filteredLeaderboard.reduce((max, p) => p.trades > max.trades ? p : max, filteredLeaderboard[0])?.name}
                </p>
                <p className="text-sm text-purple-500">
                  {Math.max(...filteredLeaderboard.map(p => p.trades))} trades
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
