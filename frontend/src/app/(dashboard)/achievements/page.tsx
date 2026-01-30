"use client"

import { useState, useMemo } from "react"
import {
  Trophy,
  Target,
  TrendingUp,
  Wallet,
  Flame,
  Users,
  BarChart3,
  Search,
  Filter,
  Lock,
  Unlock,
  Star,
  Zap,
  Clock,
  ChevronRight,
  Sparkles,
  Gift,
  Eye,
  EyeOff,
  Share2,
  Crown,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Types
type Rarity = "common" | "rare" | "epic" | "legendary"
type Category = "fundamentals" | "profit" | "portfolio" | "streaks" | "competitive" | "advanced" | "secret"

interface Achievement {
  id: string
  name: string
  description: string
  category: Category
  rarity: Rarity
  xpReward: number
  progress: number
  maxProgress: number
  unlocked: boolean
  unlockedAt?: string
  icon: string
  titleReward?: string
  secret?: boolean
  hint?: string
}

// Achievement data
const achievements: Achievement[] = [
  // 🎯 TRADING FUNDAMENTALS
  { id: "first-steps", name: "First Steps", description: "Complete your first trade", category: "fundamentals", rarity: "common", xpReward: 50, progress: 1, maxProgress: 1, unlocked: true, unlockedAt: "2026-01-15", icon: "🎯" },
  { id: "market-explorer", name: "Market Explorer", description: "View 50 different stocks", category: "fundamentals", rarity: "common", xpReward: 100, progress: 42, maxProgress: 50, unlocked: false, icon: "🔍" },
  { id: "quick-draw", name: "Quick Draw", description: "Execute a trade in under 10 seconds", category: "fundamentals", rarity: "rare", xpReward: 150, progress: 1, maxProgress: 1, unlocked: true, unlockedAt: "2026-01-20", icon: "⚡" },
  { id: "patient-trader", name: "Patient Trader", description: "Hold a position for 7+ days", category: "fundamentals", rarity: "common", xpReward: 100, progress: 5, maxProgress: 7, unlocked: false, icon: "⏳" },
  { id: "day-trader", name: "Day Trader", description: "Complete 10 trades in a single day", category: "fundamentals", rarity: "rare", xpReward: 200, progress: 8, maxProgress: 10, unlocked: false, icon: "📅" },
  { id: "bargain-hunter", name: "Bargain Hunter", description: "Buy a stock at its 52-week low", category: "fundamentals", rarity: "epic", xpReward: 300, progress: 0, maxProgress: 1, unlocked: false, icon: "🏷️" },
  { id: "peak-performer", name: "Peak Performer", description: "Sell a stock at its 52-week high", category: "fundamentals", rarity: "epic", xpReward: 300, progress: 0, maxProgress: 1, unlocked: false, icon: "🏔️" },
  { id: "limit-master", name: "Limit Master", description: "Execute 10 limit orders", category: "fundamentals", rarity: "rare", xpReward: 200, progress: 7, maxProgress: 10, unlocked: false, icon: "📊" },
  { id: "stop-loss-guru", name: "Stop Loss Guru", description: "Set stop losses on 25 trades", category: "fundamentals", rarity: "rare", xpReward: 250, progress: 18, maxProgress: 25, unlocked: false, icon: "🛡️" },
  { id: "volume-dealer", name: "Volume Dealer", description: "Trade 1,000+ shares in one transaction", category: "fundamentals", rarity: "epic", xpReward: 350, progress: 0, maxProgress: 1, unlocked: false, icon: "📦" },

  // 💰 PROFIT MILESTONES
  { id: "penny-profit", name: "Penny Profit", description: "Earn your first $1", category: "profit", rarity: "common", xpReward: 25, progress: 1, maxProgress: 1, unlocked: true, unlockedAt: "2026-01-15", icon: "🪙" },
  { id: "hundred-club", name: "Hundred Club", description: "Reach $100 profit", category: "profit", rarity: "common", xpReward: 100, progress: 100, maxProgress: 100, unlocked: true, unlockedAt: "2026-01-18", icon: "💵" },
  { id: "four-figures", name: "Four Figures", description: "Hit $1,000 total profit", category: "profit", rarity: "rare", xpReward: 300, progress: 850, maxProgress: 1000, unlocked: false, icon: "💰" },
  { id: "five-star", name: "Five Star", description: "Achieve $5,000 profit", category: "profit", rarity: "epic", xpReward: 500, progress: 850, maxProgress: 5000, unlocked: false, icon: "⭐" },
  { id: "ten-grand", name: "Ten Grand", description: "Reach $10,000 profit", category: "profit", rarity: "legendary", xpReward: 1000, progress: 850, maxProgress: 10000, unlocked: false, icon: "💎", titleReward: "Money Maker" },
  { id: "daily-double", name: "Daily Double", description: "Double your daily starting balance in one day", category: "profit", rarity: "legendary", xpReward: 750, progress: 0, maxProgress: 1, unlocked: false, icon: "🎰", titleReward: "Day Trader Elite" },
  { id: "perfect-week", name: "Perfect Week", description: "Profit every day for 5 consecutive trading days", category: "profit", rarity: "epic", xpReward: 400, progress: 3, maxProgress: 5, unlocked: false, icon: "📈" },
  { id: "monthly-master", name: "Monthly Master", description: "End a month with 20%+ gains", category: "profit", rarity: "epic", xpReward: 500, progress: 12, maxProgress: 20, unlocked: false, icon: "📆" },
  { id: "single-trade-hero", name: "Single Trade Hero", description: "Earn $500+ from a single trade", category: "profit", rarity: "epic", xpReward: 400, progress: 0, maxProgress: 1, unlocked: false, icon: "🦸" },
  { id: "comeback-kid", name: "Comeback Kid", description: "Recover from a -10% loss to breakeven", category: "profit", rarity: "rare", xpReward: 300, progress: 0, maxProgress: 1, unlocked: false, icon: "🔄" },

  // 📊 PORTFOLIO MANAGEMENT
  { id: "diversification-novice", name: "Diversification Novice", description: "Own stocks from 3 different sectors", category: "portfolio", rarity: "common", xpReward: 100, progress: 3, maxProgress: 3, unlocked: true, unlockedAt: "2026-01-22", icon: "🥧" },
  { id: "sector-specialist", name: "Sector Specialist", description: "Own 5+ stocks from the same sector", category: "portfolio", rarity: "rare", xpReward: 200, progress: 3, maxProgress: 5, unlocked: false, icon: "🎯" },
  { id: "balanced-portfolio", name: "Balanced Portfolio", description: "Maintain equal allocation across 5 stocks", category: "portfolio", rarity: "rare", xpReward: 250, progress: 0, maxProgress: 1, unlocked: false, icon: "⚖️" },
  { id: "risk-manager", name: "Risk Manager", description: "Keep portfolio volatility under 15% for a month", category: "portfolio", rarity: "epic", xpReward: 400, progress: 18, maxProgress: 30, unlocked: false, icon: "🔒" },
  { id: "blue-chip-collector", name: "Blue Chip Collector", description: "Own 10 Fortune 500 stocks", category: "portfolio", rarity: "rare", xpReward: 300, progress: 6, maxProgress: 10, unlocked: false, icon: "💙" },
  { id: "tech-titan", name: "Tech Titan", description: "Allocate 50%+ portfolio to tech stocks", category: "portfolio", rarity: "rare", xpReward: 200, progress: 45, maxProgress: 50, unlocked: false, icon: "💻" },
  { id: "value-investor", name: "Value Investor", description: "Own 5 stocks with P/E ratio under 15", category: "portfolio", rarity: "epic", xpReward: 350, progress: 2, maxProgress: 5, unlocked: false, icon: "🔎" },
  { id: "growth-chaser", name: "Growth Chaser", description: "Own 5 high-growth stocks (50%+ annual growth)", category: "portfolio", rarity: "epic", xpReward: 350, progress: 1, maxProgress: 5, unlocked: false, icon: "🚀" },

  // 🔥 STREAKS & CONSISTENCY
  { id: "hot-streak", name: "Hot Streak", description: "Win 3 trades in a row", category: "streaks", rarity: "common", xpReward: 75, progress: 3, maxProgress: 3, unlocked: true, unlockedAt: "2026-01-19", icon: "🔥" },
  { id: "unstoppable", name: "Unstoppable", description: "Win 5 trades in a row", category: "streaks", rarity: "rare", xpReward: 200, progress: 5, maxProgress: 5, unlocked: true, unlockedAt: "2026-01-25", icon: "💪" },
  { id: "perfect-ten", name: "Perfect Ten", description: "Win 10 trades in a row", category: "streaks", rarity: "legendary", xpReward: 750, progress: 5, maxProgress: 10, unlocked: false, icon: "🏆", titleReward: "Trading God" },
  { id: "daily-dedication", name: "Daily Dedication", description: "Log in 7 days consecutively", category: "streaks", rarity: "common", xpReward: 100, progress: 7, maxProgress: 7, unlocked: true, unlockedAt: "2026-01-22", icon: "📱" },
  { id: "monthly-regular", name: "Monthly Regular", description: "Log in 30 days consecutively", category: "streaks", rarity: "epic", xpReward: 500, progress: 15, maxProgress: 30, unlocked: false, icon: "📅" },
  { id: "active-trader", name: "Active Trader", description: "Trade every day for a week", category: "streaks", rarity: "rare", xpReward: 250, progress: 5, maxProgress: 7, unlocked: false, icon: "⚡" },
  { id: "morning-ritual", name: "Morning Ritual", description: "Trade within first hour of market open for 10 days", category: "streaks", rarity: "rare", xpReward: 300, progress: 6, maxProgress: 10, unlocked: false, icon: "🌅" },
  { id: "never-quit", name: "Never Quit", description: "Maintain positive returns for 14 consecutive days", category: "streaks", rarity: "epic", xpReward: 450, progress: 8, maxProgress: 14, unlocked: false, icon: "💯" },

  // 🏆 COMPETITIVE & SOCIAL
  { id: "leaderboard-debut", name: "Leaderboard Debut", description: "Enter top 100 leaderboard", category: "competitive", rarity: "common", xpReward: 100, progress: 1, maxProgress: 1, unlocked: true, unlockedAt: "2026-01-20", icon: "📋" },
  { id: "top-50", name: "Top 50", description: "Reach top 50 on leaderboard", category: "competitive", rarity: "rare", xpReward: 250, progress: 1, maxProgress: 1, unlocked: true, unlockedAt: "2026-01-26", icon: "🎖️" },
  { id: "top-10", name: "Top 10", description: "Break into top 10", category: "competitive", rarity: "epic", xpReward: 500, progress: 0, maxProgress: 1, unlocked: false, icon: "🥇" },
  { id: "podium-finish", name: "Podium Finish", description: "Reach top 3", category: "competitive", rarity: "legendary", xpReward: 750, progress: 0, maxProgress: 1, unlocked: false, icon: "🏅", titleReward: "Elite Trader" },
  { id: "champion", name: "Champion", description: "Reach #1 on leaderboard", category: "competitive", rarity: "legendary", xpReward: 1500, progress: 0, maxProgress: 1, unlocked: false, icon: "👑", titleReward: "Trading Legend" },
  { id: "league-leader", name: "League Leader", description: "Win a weekly league competition", category: "competitive", rarity: "epic", xpReward: 400, progress: 0, maxProgress: 1, unlocked: false, icon: "🏆" },
  { id: "social-trader", name: "Social Trader", description: "Join 3 different leagues", category: "competitive", rarity: "rare", xpReward: 200, progress: 2, maxProgress: 3, unlocked: false, icon: "👥" },

  // 📈 ADVANCED TRADING
  { id: "technical-analyst", name: "Technical Analyst", description: "Use 5 different technical indicators", category: "advanced", rarity: "rare", xpReward: 250, progress: 3, maxProgress: 5, unlocked: false, icon: "📉" },
  { id: "earnings-player", name: "Earnings Player", description: "Trade around 10 earnings announcements", category: "advanced", rarity: "rare", xpReward: 300, progress: 4, maxProgress: 10, unlocked: false, icon: "📊" },
  { id: "volatility-master", name: "Volatility Master", description: "Profit from a stock with 10%+ daily move", category: "advanced", rarity: "epic", xpReward: 400, progress: 0, maxProgress: 1, unlocked: false, icon: "🎢" },
  { id: "market-timer", name: "Market Timer", description: "Buy at exact daily low, sell at exact daily high", category: "advanced", rarity: "legendary", xpReward: 1000, progress: 0, maxProgress: 1, unlocked: false, icon: "⏰", titleReward: "Perfect Timing" },
  { id: "options-explorer", name: "Options Explorer", description: "Execute 5 options trades", category: "advanced", rarity: "epic", xpReward: 350, progress: 0, maxProgress: 5, unlocked: false, icon: "🎲" },
  { id: "dividend-collector", name: "Dividend Collector", description: "Hold 10 dividend-paying stocks", category: "advanced", rarity: "rare", xpReward: 250, progress: 4, maxProgress: 10, unlocked: false, icon: "💸" },
  { id: "contrarian", name: "Contrarian", description: "Profit from a trade against market sentiment", category: "advanced", rarity: "epic", xpReward: 400, progress: 0, maxProgress: 1, unlocked: false, icon: "🔀" },

  // 🔮 SECRET ACHIEVEMENTS
  { id: "secret-1", name: "???", description: "This achievement is hidden", category: "secret", rarity: "legendary", xpReward: 500, progress: 0, maxProgress: 1, unlocked: false, icon: "❓", secret: true, hint: "Trade at midnight..." },
  { id: "secret-2", name: "???", description: "This achievement is hidden", category: "secret", rarity: "epic", xpReward: 350, progress: 0, maxProgress: 1, unlocked: false, icon: "❓", secret: true, hint: "Numbers in sequence..." },
  { id: "secret-3", name: "Diamond Hands", description: "Hold through a -30% dip and recover", category: "secret", rarity: "legendary", xpReward: 750, progress: 1, maxProgress: 1, unlocked: true, unlockedAt: "2026-01-28", icon: "💎", secret: true, titleReward: "Diamond Hands" },
  { id: "secret-4", name: "???", description: "This achievement is hidden", category: "secret", rarity: "epic", xpReward: 400, progress: 0, maxProgress: 1, unlocked: false, icon: "❓", secret: true, hint: "First of its kind..." },
  { id: "secret-5", name: "???", description: "This achievement is hidden", category: "secret", rarity: "legendary", xpReward: 1000, progress: 0, maxProgress: 1, unlocked: false, icon: "❓", secret: true, hint: "Complete them all..." },
]

const categoryInfo: Record<Category, { name: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  fundamentals: { name: "Trading Fundamentals", icon: <Target className="h-5 w-5" />, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  profit: { name: "Profit Milestones", icon: <TrendingUp className="h-5 w-5" />, color: "text-green-500", bgColor: "bg-green-500/10" },
  portfolio: { name: "Portfolio Management", icon: <Wallet className="h-5 w-5" />, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  streaks: { name: "Streaks & Consistency", icon: <Flame className="h-5 w-5" />, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  competitive: { name: "Competitive & Social", icon: <Trophy className="h-5 w-5" />, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  advanced: { name: "Advanced Trading", icon: <BarChart3 className="h-5 w-5" />, color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
  secret: { name: "Secret Achievements", icon: <Lock className="h-5 w-5" />, color: "text-pink-500", bgColor: "bg-pink-500/10" },
}

const rarityInfo: Record<Rarity, { name: string; color: string; bgColor: string; borderColor: string; glow: string }> = {
  common: { name: "Common", color: "text-slate-400", bgColor: "bg-slate-500/10", borderColor: "border-slate-500/30", glow: "" },
  rare: { name: "Rare", color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30", glow: "shadow-blue-500/20" },
  epic: { name: "Epic", color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30", glow: "shadow-purple-500/20" },
  legendary: { name: "Legendary", color: "text-yellow-400", bgColor: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20", borderColor: "border-yellow-500/50", glow: "shadow-yellow-500/30" },
}

export default function AchievementsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all")
  const [selectedRarity, setSelectedRarity] = useState<Rarity | "all">("all")
  const [showLocked, setShowLocked] = useState<"all" | "unlocked" | "locked">("all")
  const [sortBy, setSortBy] = useState<"default" | "progress" | "rarity" | "recent">("default")
  const [showSecrets, setShowSecrets] = useState(true)

  // Calculate stats
  const totalAchievements = achievements.length
  const unlockedAchievements = achievements.filter(a => a.unlocked).length
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0)
  const possibleXP = achievements.reduce((sum, a) => sum + a.xpReward, 0)
  const completionPercent = Math.round((unlockedAchievements / totalAchievements) * 100)

  // Filter and sort achievements
  const filteredAchievements = useMemo(() => {
    let filtered = achievements.filter(achievement => {
      // Search filter
      const matchesSearch = achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Category filter
      const matchesCategory = selectedCategory === "all" || achievement.category === selectedCategory
      
      // Rarity filter
      const matchesRarity = selectedRarity === "all" || achievement.rarity === selectedRarity
      
      // Locked/unlocked filter
      const matchesLocked = showLocked === "all" ||
        (showLocked === "unlocked" && achievement.unlocked) ||
        (showLocked === "locked" && !achievement.unlocked)
      
      // Secret filter
      const matchesSecret = showSecrets || !achievement.secret || achievement.unlocked

      return matchesSearch && matchesCategory && matchesRarity && matchesLocked && matchesSecret
    })

    // Sort
    switch (sortBy) {
      case "progress":
        filtered.sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress))
        break
      case "rarity":
        const rarityOrder: Rarity[] = ["legendary", "epic", "rare", "common"]
        filtered.sort((a, b) => rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity))
        break
      case "recent":
        filtered.sort((a, b) => {
          if (a.unlockedAt && b.unlockedAt) return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
          if (a.unlockedAt) return -1
          if (b.unlockedAt) return 1
          return 0
        })
        break
      default:
        // Default: unlocked first, then by category
        filtered.sort((a, b) => {
          if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1
          return 0
        })
    }

    return filtered
  }, [searchQuery, selectedCategory, selectedRarity, showLocked, sortBy, showSecrets])

  // Get achievements by category for the category view
  const achievementsByCategory = useMemo(() => {
    const grouped: Record<Category, Achievement[]> = {
      fundamentals: [],
      profit: [],
      portfolio: [],
      streaks: [],
      competitive: [],
      advanced: [],
      secret: [],
    }
    
    filteredAchievements.forEach(a => {
      grouped[a.category].push(a)
    })
    
    return grouped
  }, [filteredAchievements])

  // Find closest to unlocking
  const closestToUnlock = useMemo(() => {
    return achievements
      .filter(a => !a.unlocked && !a.secret)
      .sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress))
      .slice(0, 3)
  }, [])

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Achievements
            </h1>
            <p className="text-muted-foreground">
              Track your trading milestones and unlock rewards
            </p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="md:col-span-2 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Overall Progress</h3>
                  <p className="text-sm text-muted-foreground">Keep trading to unlock more!</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{unlockedAchievements}/{totalAchievements}</p>
                  <p className="text-sm text-muted-foreground">{completionPercent}% Complete</p>
                </div>
              </div>
              <Progress value={completionPercent} className="h-3" />
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>{totalXP.toLocaleString()} / {possibleXP.toLocaleString()} XP earned</span>
                </div>
                <Badge variant="secondary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {achievements.filter(a => a.unlocked && a.titleReward).length} Titles Unlocked
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-full bg-purple-500/10 p-2">
                  <Gift className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Recent Unlock</p>
                  <p className="font-semibold">Diamond Hands</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>2 days ago</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-full bg-green-500/10 p-2">
                  <Target className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Closest to Unlock</p>
                  <p className="font-semibold">{closestToUnlock[0]?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={(closestToUnlock[0]?.progress / closestToUnlock[0]?.maxProgress) * 100} className="h-2 flex-1" />
                <span className="text-sm font-medium">
                  {closestToUnlock[0]?.progress}/{closestToUnlock[0]?.maxProgress}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rarity Breakdown */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {(["common", "rare", "epic", "legendary"] as Rarity[]).map((rarity) => {
            const count = achievements.filter(a => a.rarity === rarity).length
            const unlocked = achievements.filter(a => a.rarity === rarity && a.unlocked).length
            return (
              <Card key={rarity} className={cn("border", rarityInfo[rarity].borderColor)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", rarity === "legendary" ? "bg-gradient-to-r from-yellow-400 to-orange-400" : rarityInfo[rarity].bgColor.replace("/10", ""))} />
                      <span className={cn("font-medium capitalize", rarityInfo[rarity].color)}>{rarity}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{unlocked}/{count}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[200px] max-w-[300px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search achievements..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as Category | "all")}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(categoryInfo).map(([key, info]) => (
                      <SelectItem key={key} value={key}>{info.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRarity} onValueChange={(v) => setSelectedRarity(v as Rarity | "all")}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rarities</SelectItem>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={showLocked} onValueChange={(v) => setShowLocked(v as "all" | "unlocked" | "locked")}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="unlocked">Unlocked</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                    <SelectItem value="rarity">Rarity</SelectItem>
                    <SelectItem value="recent">Recently Unlocked</SelectItem>
                  </SelectContent>
                </Select>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={showSecrets ? "default" : "outline"}
                      size="icon"
                      onClick={() => setShowSecrets(!showSecrets)}
                    >
                      {showSecrets ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {showSecrets ? "Hide Secret Achievements" : "Show Secret Achievements"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Categories */}
        <div className="space-y-8">
          {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => {
            if (categoryAchievements.length === 0) return null
            const info = categoryInfo[category as Category]
            const unlockedInCategory = categoryAchievements.filter(a => a.unlocked).length
            
            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("rounded-lg p-2", info.bgColor)}>
                      <span className={info.color}>{info.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{info.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {unlockedInCategory}/{categoryAchievements.length} unlocked
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={(unlockedInCategory / categoryAchievements.length) * 100} 
                    className="w-32 h-2"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryAchievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="font-medium">No achievements found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}

// Achievement Card Component
function AchievementCard({ achievement }: { achievement: Achievement }) {
  const rarity = rarityInfo[achievement.rarity]
  const progressPercent = (achievement.progress / achievement.maxProgress) * 100
  const isSecret = achievement.secret && !achievement.unlocked

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer group",
            rarity.borderColor,
            achievement.unlocked && rarity.glow && `shadow-lg ${rarity.glow}`,
            !achievement.unlocked && "opacity-75 hover:opacity-100"
          )}
        >
          {/* Rarity indicator */}
          {achievement.rarity === "legendary" && achievement.unlocked && (
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5" />
          )}
          
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform group-hover:scale-110",
                  achievement.unlocked ? rarity.bgColor : "bg-muted"
                )}
              >
                {isSecret ? "🔒" : achievement.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={cn(
                    "font-semibold truncate",
                    isSecret && "text-muted-foreground"
                  )}>
                    {isSecret ? "???" : achievement.name}
                  </h3>
                  {achievement.unlocked && (
                    <Unlock className="h-4 w-4 text-green-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {isSecret ? (achievement.hint || "This achievement is hidden") : achievement.description}
                </p>
              </div>
            </div>

            {/* Progress & Rewards */}
            <div className="mt-3 space-y-2">
              {!achievement.unlocked && !isSecret && (
                <div className="flex items-center gap-2">
                  <Progress value={progressPercent} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Badge variant="outline" className={cn("text-xs", rarity.color)}>
                  {rarity.name}
                </Badge>
                <div className="flex items-center gap-2">
                  {achievement.titleReward && (
                    <Badge variant="secondary" className="text-xs">
                      <Crown className="h-3 w-3 mr-1" />
                      Title
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                    {achievement.xpReward} XP
                  </Badge>
                </div>
              </div>
            </div>

            {/* Unlocked date */}
            {achievement.unlocked && achievement.unlockedAt && (
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>

          {/* Shine effect for legendary */}
          {achievement.rarity === "legendary" && achievement.unlocked && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          )}
        </Card>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[300px]">
        <div className="space-y-1">
          <p className="font-semibold">{isSecret ? "Secret Achievement" : achievement.name}</p>
          <p className="text-sm text-muted-foreground">
            {isSecret ? (achievement.hint || "Complete hidden requirements to unlock") : achievement.description}
          </p>
          {achievement.titleReward && (
            <p className="text-sm text-yellow-500">
              🏆 Unlocks title: &quot;{achievement.titleReward}&quot;
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
