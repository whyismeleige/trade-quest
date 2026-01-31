"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Zap,
  Clock,
  Target,
  TrendingUp,
  Trophy,
  Flame,
  Star,
  Gift,
  Calendar,
  CheckCircle2,
  Sparkles,
  Coins,
  Timer,
  Rocket,
  Brain,
  Shield,
  Swords,
  Crown,
  Gem,
  PlayCircle,
  BarChart3,
  CircleDollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
interface Challenge {
  id: string
  title: string
  description: string
  xpReward: number
  coinReward?: number
  progress: number
  maxProgress: number
  type: "daily" | "weekly" | "special" | "achievement"
  difficulty: "easy" | "medium" | "hard" | "legendary"
  icon: React.ReactNode
  timeRemaining?: string
  isCompleted: boolean
  isClaimed: boolean
  streak?: number
  category: string
}

interface XPActivity {
  id: string
  title: string
  description: string
  xpPerAction: number
  dailyLimit?: number
  currentCount: number
  icon: React.ReactNode
  category: "trading" | "learning" | "social" | "daily"
}

// Daily Challenges Data
const dailyChallenges: Challenge[] = [
  {
    id: "daily-1",
    title: "First Trade of the Day",
    description: "Execute your first trade today",
    xpReward: 50,
    coinReward: 10,
    progress: 1,
    maxProgress: 1,
    type: "daily",
    difficulty: "easy",
    icon: <PlayCircle className="h-5 w-5" />,
    timeRemaining: "23h 45m",
    isCompleted: true,
    isClaimed: false,
    category: "Trading",
  },
  {
    id: "daily-2",
    title: "Market Analyst",
    description: "View 5 different stock charts",
    xpReward: 75,
    coinReward: 15,
    progress: 3,
    maxProgress: 5,
    type: "daily",
    difficulty: "easy",
    icon: <BarChart3 className="h-5 w-5" />,
    timeRemaining: "23h 45m",
    isCompleted: false,
    isClaimed: false,
    category: "Research",
  },
  {
    id: "daily-3",
    title: "Profit Hunter",
    description: "Make a profitable trade (any amount)",
    xpReward: 100,
    coinReward: 25,
    progress: 0,
    maxProgress: 1,
    type: "daily",
    difficulty: "medium",
    icon: <TrendingUp className="h-5 w-5" />,
    timeRemaining: "23h 45m",
    isCompleted: false,
    isClaimed: false,
    category: "Trading",
  },
  {
    id: "daily-4",
    title: "Diversify",
    description: "Hold positions in 3 different sectors",
    xpReward: 125,
    coinReward: 30,
    progress: 2,
    maxProgress: 3,
    type: "daily",
    difficulty: "medium",
    icon: <Target className="h-5 w-5" />,
    timeRemaining: "23h 45m",
    isCompleted: false,
    isClaimed: false,
    category: "Portfolio",
  },
  {
    id: "daily-5",
    title: "Quick Reflexes",
    description: "Complete 3 trades within 1 hour",
    xpReward: 150,
    coinReward: 40,
    progress: 1,
    maxProgress: 3,
    type: "daily",
    difficulty: "hard",
    icon: <Zap className="h-5 w-5" />,
    timeRemaining: "23h 45m",
    isCompleted: false,
    isClaimed: false,
    category: "Trading",
  },
  {
    id: "daily-6",
    title: "Login Streak",
    description: "Log in for 7 consecutive days",
    xpReward: 200,
    coinReward: 50,
    progress: 5,
    maxProgress: 7,
    type: "daily",
    difficulty: "easy",
    icon: <Flame className="h-5 w-5" />,
    timeRemaining: "23h 45m",
    isCompleted: false,
    isClaimed: false,
    streak: 5,
    category: "Engagement",
  },
]

// Weekly Challenges Data
const weeklyChallenges: Challenge[] = [
  {
    id: "weekly-1",
    title: "Trading Volume King",
    description: "Execute trades worth ₹50,000 total this week",
    xpReward: 500,
    coinReward: 100,
    progress: 32500,
    maxProgress: 50000,
    type: "weekly",
    difficulty: "medium",
    icon: <Crown className="h-5 w-5" />,
    timeRemaining: "5d 12h",
    isCompleted: false,
    isClaimed: false,
    category: "Trading",
  },
  {
    id: "weekly-2",
    title: "Consistent Trader",
    description: "Trade on 5 different days this week",
    xpReward: 400,
    coinReward: 75,
    progress: 3,
    maxProgress: 5,
    type: "weekly",
    difficulty: "easy",
    icon: <Calendar className="h-5 w-5" />,
    timeRemaining: "5d 12h",
    isCompleted: false,
    isClaimed: false,
    category: "Engagement",
  },
  {
    id: "weekly-3",
    title: "Portfolio Growth",
    description: "Grow your portfolio by 5% this week",
    xpReward: 750,
    coinReward: 150,
    progress: 3.2,
    maxProgress: 5,
    type: "weekly",
    difficulty: "hard",
    icon: <TrendingUp className="h-5 w-5" />,
    timeRemaining: "5d 12h",
    isCompleted: false,
    isClaimed: false,
    category: "Performance",
  },
  {
    id: "weekly-4",
    title: "Risk Manager",
    description: "Set stop-loss on 10 trades",
    xpReward: 350,
    coinReward: 60,
    progress: 6,
    maxProgress: 10,
    type: "weekly",
    difficulty: "medium",
    icon: <Shield className="h-5 w-5" />,
    timeRemaining: "5d 12h",
    isCompleted: false,
    isClaimed: false,
    category: "Risk",
  },
  {
    id: "weekly-5",
    title: "Social Butterfly",
    description: "Share 3 trade insights with the community",
    xpReward: 300,
    coinReward: 50,
    progress: 1,
    maxProgress: 3,
    type: "weekly",
    difficulty: "easy",
    icon: <Sparkles className="h-5 w-5" />,
    timeRemaining: "5d 12h",
    isCompleted: false,
    isClaimed: false,
    category: "Social",
  },
  {
    id: "weekly-6",
    title: "Market Master",
    description: "Correctly predict 5 market movements",
    xpReward: 1000,
    coinReward: 200,
    progress: 2,
    maxProgress: 5,
    type: "weekly",
    difficulty: "legendary",
    icon: <Brain className="h-5 w-5" />,
    timeRemaining: "5d 12h",
    isCompleted: false,
    isClaimed: false,
    category: "Prediction",
  },
]

// Special/Event Challenges
const specialChallenges: Challenge[] = [
  {
    id: "special-1",
    title: "🎮 Gaming Stock Rally",
    description: "Trade any gaming sector stock 3 times during the event",
    xpReward: 1500,
    coinReward: 300,
    progress: 1,
    maxProgress: 3,
    type: "special",
    difficulty: "medium",
    icon: <Rocket className="h-5 w-5" />,
    timeRemaining: "2d 8h",
    isCompleted: false,
    isClaimed: false,
    category: "Event",
  },
  {
    id: "special-2",
    title: "🏆 Weekend Warrior",
    description: "Complete all daily challenges on Saturday and Sunday",
    xpReward: 2000,
    coinReward: 500,
    progress: 0,
    maxProgress: 2,
    type: "special",
    difficulty: "hard",
    icon: <Swords className="h-5 w-5" />,
    timeRemaining: "3d 0h",
    isCompleted: false,
    isClaimed: false,
    category: "Event",
  },
  {
    id: "special-3",
    title: "💎 Diamond Hands",
    description: "Hold a position for 30 days without selling",
    xpReward: 3000,
    coinReward: 750,
    progress: 18,
    maxProgress: 30,
    type: "special",
    difficulty: "legendary",
    icon: <Gem className="h-5 w-5" />,
    timeRemaining: "12d 0h",
    isCompleted: false,
    isClaimed: false,
    category: "Long-term",
  },
  {
    id: "special-4",
    title: "🌙 Night Owl",
    description: "Make a trade during after-hours (6PM - 9PM)",
    xpReward: 500,
    coinReward: 100,
    progress: 0,
    maxProgress: 1,
    type: "special",
    difficulty: "easy",
    icon: <Clock className="h-5 w-5" />,
    timeRemaining: "1d 6h",
    isCompleted: false,
    isClaimed: false,
    category: "Event",
  },
]

// XP Farming Activities
const xpActivities: XPActivity[] = [
  {
    id: "xp-1",
    title: "Execute a Trade",
    description: "Earn XP for every trade you make",
    xpPerAction: 10,
    dailyLimit: 50,
    currentCount: 12,
    icon: <TrendingUp className="h-5 w-5" />,
    category: "trading",
  },
  {
    id: "xp-2",
    title: "Profitable Trade",
    description: "Bonus XP for closing a trade in profit",
    xpPerAction: 25,
    dailyLimit: 20,
    currentCount: 5,
    icon: <CircleDollarSign className="h-5 w-5" />,
    category: "trading",
  },
  {
    id: "xp-3",
    title: "View Stock Details",
    description: "Research stocks to earn XP",
    xpPerAction: 5,
    dailyLimit: 100,
    currentCount: 34,
    icon: <BarChart3 className="h-5 w-5" />,
    category: "learning",
  },
  {
    id: "xp-4",
    title: "Complete a Lesson",
    description: "Learn trading concepts",
    xpPerAction: 50,
    dailyLimit: 10,
    currentCount: 2,
    icon: <Brain className="h-5 w-5" />,
    category: "learning",
  },
  {
    id: "xp-5",
    title: "Daily Login",
    description: "Just show up every day",
    xpPerAction: 25,
    currentCount: 1,
    icon: <Calendar className="h-5 w-5" />,
    category: "daily",
  },
  {
    id: "xp-6",
    title: "Maintain Streak",
    description: "Bonus XP per day of login streak",
    xpPerAction: 10,
    currentCount: 5,
    icon: <Flame className="h-5 w-5" />,
    category: "daily",
  },
  {
    id: "xp-7",
    title: "Share Trade",
    description: "Share your trades with the community",
    xpPerAction: 15,
    dailyLimit: 10,
    currentCount: 3,
    icon: <Sparkles className="h-5 w-5" />,
    category: "social",
  },
  {
    id: "xp-8",
    title: "Like/Comment",
    description: "Engage with community posts",
    xpPerAction: 2,
    dailyLimit: 50,
    currentCount: 18,
    icon: <Star className="h-5 w-5" />,
    category: "social",
  },
]

// Helper functions
const getDifficultyColor = (difficulty: Challenge["difficulty"]) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "medium":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "hard":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20"
    case "legendary":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20"
  }
}

const getDifficultyLabel = (difficulty: Challenge["difficulty"]) => {
  switch (difficulty) {
    case "easy":
      return "Easy"
    case "medium":
      return "Medium"
    case "hard":
      return "Hard"
    case "legendary":
      return "Legendary"
  }
}

export default function ChallengesPage() {
  const [claimedChallenges, setClaimedChallenges] = useState<string[]>([])

  const handleClaim = (challengeId: string) => {
    setClaimedChallenges((prev) => [...prev, challengeId])
  }

  const totalDailyXP = dailyChallenges.reduce((acc, c) => acc + c.xpReward, 0)
  const earnedDailyXP = dailyChallenges
    .filter((c) => c.isCompleted || claimedChallenges.includes(c.id))
    .reduce((acc, c) => acc + c.xpReward, 0)

  const completedWeekly = weeklyChallenges.filter((c) => c.progress >= c.maxProgress).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Challenges</h1>
          <p className="text-muted-foreground">
            Complete challenges to earn XP, coins, and exclusive rewards
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Current Streak</p>
                <p className="text-lg font-bold">5 Days</p>
              </div>
            </div>
          </Card>
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-xs text-muted-foreground">Today&apos;s XP</p>
                <p className="text-lg font-bold">+450 XP</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Daily Progress Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Daily Challenge Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Complete all daily challenges for a bonus 500 XP!
                </p>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>{dailyChallenges.filter((c) => c.isCompleted).length}/{dailyChallenges.length} Completed</span>
                <span className="font-semibold">{earnedDailyXP}/{totalDailyXP} XP</span>
              </div>
              <Progress 
                value={(dailyChallenges.filter((c) => c.isCompleted).length / dailyChallenges.length) * 100} 
                className="h-3"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span>Resets in 23h 45m</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="daily" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Daily</span>
          </TabsTrigger>
          <TabsTrigger value="weekly" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Weekly</span>
          </TabsTrigger>
          <TabsTrigger value="special" className="gap-2">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Special</span>
          </TabsTrigger>
          <TabsTrigger value="xp-farm" className="gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">XP Farm</span>
          </TabsTrigger>
        </TabsList>

        {/* Daily Challenges */}
        <TabsContent value="daily" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dailyChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isClaimed={claimedChallenges.includes(challenge.id)}
                onClaim={() => handleClaim(challenge.id)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Weekly Challenges */}
        <TabsContent value="weekly" className="space-y-4">
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <div>
                    <p className="font-semibold">Weekly Challenge Bonus</p>
                    <p className="text-sm text-muted-foreground">
                      Complete 4+ weekly challenges for 1,000 bonus XP
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{completedWeekly}/4</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {weeklyChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isClaimed={claimedChallenges.includes(challenge.id)}
                onClaim={() => handleClaim(challenge.id)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Special Challenges */}
        <TabsContent value="special" className="space-y-4">
          <Card className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                  <Rocket className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Limited Time Events</h3>
                  <p className="text-sm text-muted-foreground">
                    Special challenges with exclusive rewards. Don&apos;t miss out!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            {specialChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isClaimed={claimedChallenges.includes(challenge.id)}
                onClaim={() => handleClaim(challenge.id)}
                isLarge
              />
            ))}
          </div>
        </TabsContent>

        {/* XP Farming */}
        <TabsContent value="xp-farm" className="space-y-6">
          {/* XP Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Trading XP</p>
                    <p className="text-xl font-bold">+245</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Brain className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Learning XP</p>
                    <p className="text-xl font-bold">+170</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Social XP</p>
                    <p className="text-xl font-bold">+81</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                    <Flame className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Daily Bonus</p>
                    <p className="text-xl font-bold">+75</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* XP Multiplier Banner */}
          <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 animate-pulse">
                    <Sparkles className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">2x XP Weekend Active!</h3>
                      <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                        Limited Time
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      All XP earned is doubled until Sunday midnight
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-500">2x</p>
                  <p className="text-xs text-muted-foreground">Multiplier</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* XP Activities */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Trading Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Trading Activities
                </CardTitle>
                <CardDescription>Earn XP through trading actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {xpActivities
                  .filter((a) => a.category === "trading")
                  .map((activity) => (
                    <XPActivityItem key={activity.id} activity={activity} />
                  ))}
              </CardContent>
            </Card>

            {/* Learning Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-blue-500" />
                  Learning Activities
                </CardTitle>
                <CardDescription>Earn XP by learning and researching</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {xpActivities
                  .filter((a) => a.category === "learning")
                  .map((activity) => (
                    <XPActivityItem key={activity.id} activity={activity} />
                  ))}
              </CardContent>
            </Card>

            {/* Social Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Social Activities
                </CardTitle>
                <CardDescription>Earn XP by engaging with the community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {xpActivities
                  .filter((a) => a.category === "social")
                  .map((activity) => (
                    <XPActivityItem key={activity.id} activity={activity} />
                  ))}
              </CardContent>
            </Card>

            {/* Daily Bonuses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gift className="h-5 w-5 text-orange-500" />
                  Daily Bonuses
                </CardTitle>
                <CardDescription>Passive XP for showing up</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {xpActivities
                  .filter((a) => a.category === "daily")
                  .map((activity) => (
                    <XPActivityItem key={activity.id} activity={activity} />
                  ))}
                <Separator />
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                      <Flame className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium">Streak Milestone</p>
                      <p className="text-xs text-muted-foreground">
                        Reach 7-day streak for 500 bonus XP
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">5/7 days</p>
                    <Progress value={(5 / 7) * 100} className="h-1.5 w-20 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* XP Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Pro Tips for Maximizing XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 shrink-0">
                    <span className="text-sm font-bold text-green-500">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Complete Dailies First</p>
                    <p className="text-sm text-muted-foreground">
                      Daily challenges reset every 24h. Don&apos;t miss easy XP!
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 shrink-0">
                    <span className="text-sm font-bold text-blue-500">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Maintain Your Streak</p>
                    <p className="text-sm text-muted-foreground">
                      Login daily for increasing streak bonuses up to 5x
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 shrink-0">
                    <span className="text-sm font-bold text-purple-500">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Watch for 2x Events</p>
                    <p className="text-sm text-muted-foreground">
                      Stack activities during XP multiplier events
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Challenge Card Component
function ChallengeCard({
  challenge,
  isClaimed,
  onClaim,
  isLarge = false,
}: {
  challenge: Challenge
  isClaimed: boolean
  onClaim: () => void
  isLarge?: boolean
}) {
  const isComplete = challenge.progress >= challenge.maxProgress
  const progressPercent = (challenge.progress / challenge.maxProgress) * 100

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all hover:shadow-md",
        isComplete && !isClaimed && "ring-2 ring-primary",
        isClaimed && "opacity-60"
      )}
    >
      {/* Difficulty Badge */}
      <div className="absolute top-3 right-3">
        <Badge variant="outline" className={cn("text-xs", getDifficultyColor(challenge.difficulty))}>
          {getDifficultyLabel(challenge.difficulty)}
        </Badge>
      </div>

      <CardContent className={cn("p-4", isLarge && "p-6")}>
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl shrink-0",
              isComplete
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {isComplete ? <CheckCircle2 className="h-6 w-6" /> : challenge.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn("font-semibold truncate", isLarge && "text-lg")}>
                {challenge.title}
              </h3>
              {challenge.streak && (
                <Badge variant="secondary" className="gap-1 shrink-0">
                  <Flame className="h-3 w-3 text-orange-500" />
                  {challenge.streak}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {typeof challenge.progress === "number" && challenge.progress % 1 !== 0
                    ? `${challenge.progress.toFixed(1)}%`
                    : challenge.progress.toLocaleString()}{" "}
                  /{" "}
                  {typeof challenge.maxProgress === "number" && challenge.maxProgress % 1 !== 0
                    ? `${challenge.maxProgress}%`
                    : challenge.maxProgress.toLocaleString()}
                </span>
                <span className="font-medium">{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            {/* Rewards */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">{challenge.xpReward} XP</span>
                </div>
                {challenge.coinReward && (
                  <div className="flex items-center gap-1 text-sm">
                    <Coins className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold">{challenge.coinReward}</span>
                  </div>
                )}
              </div>

              {isComplete && !isClaimed ? (
                <Button size="sm" onClick={onClaim} className="gap-1">
                  <Gift className="h-4 w-4" />
                  Claim
                </Button>
              ) : isClaimed ? (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Claimed
                </Badge>
              ) : (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {challenge.timeRemaining}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// XP Activity Item Component
function XPActivityItem({ activity }: { activity: XPActivity }) {
  const isMaxed = activity.dailyLimit ? activity.currentCount >= activity.dailyLimit : false

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            isMaxed ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
          )}
        >
          {activity.icon}
        </div>
        <div>
          <p className={cn("font-medium", isMaxed && "text-muted-foreground")}>
            {activity.title}
          </p>
          <p className="text-xs text-muted-foreground">{activity.description}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-1 text-sm font-semibold">
          <Zap className="h-3.5 w-3.5 text-yellow-500" />
          +{activity.xpPerAction} XP
        </div>
        {activity.dailyLimit && (
          <p className="text-xs text-muted-foreground">
            {activity.currentCount}/{activity.dailyLimit} today
          </p>
        )}
      </div>
    </div>
  )
}
