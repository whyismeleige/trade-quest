"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Trophy,
  Target,
  TrendingUp,
  Wallet,
  Flame,
  BarChart3,
  Search,
  Lock,
  Unlock,
  Zap,
  Clock,
  Sparkles,
  Gift,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { cn } from "@/lib/utils"

import { UserAchievement } from "@/types/achievement.types"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchAchievementStats, fetchUserAchievements } from "@/store/slices/achievement.slice"

// --- Constants & Helpers ---

// Map Backend DB Category strings -> UI Theme Keys
const mapBackendCategoryToUI = (backendCategory: string): string => {
  const normalized = backendCategory.toLowerCase();
  switch (normalized) {
    case 'trading': return 'fundamentals';
    case 'profit': return 'profit';
    case 'wealth':
    case 'portfolio': return 'portfolio';
    case 'streak': return 'streaks';
    case 'social': return 'competitive';
    case 'learning': return 'advanced';
    case 'special': return 'secret';
    default: return 'fundamentals';
  }
}

const categoryInfo: Record<string, { name: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  fundamentals: { name: "Trading Fundamentals", icon: <Target className="h-5 w-5" />, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  profit: { name: "Profit Milestones", icon: <TrendingUp className="h-5 w-5" />, color: "text-green-500", bgColor: "bg-green-500/10" },
  portfolio: { name: "Portfolio Management", icon: <Wallet className="h-5 w-5" />, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  streaks: { name: "Streaks & Consistency", icon: <Flame className="h-5 w-5" />, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  competitive: { name: "Competitive & Social", icon: <Trophy className="h-5 w-5" />, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  advanced: { name: "Advanced Knowledge", icon: <BarChart3 className="h-5 w-5" />, color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
  secret: { name: "Secret Achievements", icon: <Lock className="h-5 w-5" />, color: "text-pink-500", bgColor: "bg-pink-500/10" },
}

const rarityInfo: Record<string, { name: string; color: string; bgColor: string; borderColor: string; glow: string }> = {
  common: { name: "Common", color: "text-slate-400", bgColor: "bg-slate-500/10", borderColor: "border-slate-500/30", glow: "" },
  rare: { name: "Rare", color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30", glow: "shadow-blue-500/20" },
  epic: { name: "Epic", color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30", glow: "shadow-purple-500/20" },
  legendary: { name: "Legendary", color: "text-yellow-400", bgColor: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20", borderColor: "border-yellow-500/50", glow: "shadow-yellow-500/30" },
}

export default function AchievementsPage() {
  const dispatch = useAppDispatch()
  
  const { 
    allAchievements, 
    stats, 
    loading 
  } = useAppSelector((state) => state.achievements)

  // Local State
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all")
  const [selectedRarity, setSelectedRarity] = useState<string | "all">("all")
  const [showLocked, setShowLocked] = useState<"all" | "unlocked" | "locked">("all")
  const [sortBy, setSortBy] = useState<"default" | "progress" | "rarity" | "recent">("default")
  const [showSecrets, setShowSecrets] = useState(true)

  useEffect(() => {
    dispatch(fetchUserAchievements())
    dispatch(fetchAchievementStats())
  }, [dispatch])

  // Computed Stats
  const totalAchievements = allAchievements.length
  const unlockedAchievements = allAchievements.filter(a => a.isUnlocked).length
  const completionPercent = totalAchievements > 0 
    ? Math.round((unlockedAchievements / totalAchievements) * 100) 
    : 0

  // Filter and sort
  const filteredAchievements = useMemo(() => {
    let filtered = allAchievements.filter(achievement => {
      const uiCategory = mapBackendCategoryToUI(achievement.category)

      // Search (using 'name' from backend)
      const matchesSearch = achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === "all" || uiCategory === selectedCategory
      const matchesRarity = selectedRarity === "all" || achievement.rarity === selectedRarity
      
      const matchesLocked = showLocked === "all" ||
        (showLocked === "unlocked" && achievement.isUnlocked) ||
        (showLocked === "locked" && !achievement.isUnlocked)
      
      // Backend usually has 'isSecret', handling it here visually
      const matchesSecret = showSecrets || !achievement.isSecret || achievement.isUnlocked

      return matchesSearch && matchesCategory && matchesRarity && matchesLocked && matchesSecret
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "progress":
          return (b.completionPercent || 0) - (a.completionPercent || 0)
        case "rarity":
          const rarityOrder = ["legendary", "epic", "rare", "common"]
          return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
        case "recent":
          if (a.unlockedAt && b.unlockedAt) return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
          if (a.unlockedAt) return -1
          if (b.unlockedAt) return 1
          return 0
        default:
          if (a.isUnlocked !== b.isUnlocked) return a.isUnlocked ? -1 : 1
          return 0
      }
    })
  }, [allAchievements, searchQuery, selectedCategory, selectedRarity, showLocked, sortBy, showSecrets])

  // Group by category
  const achievementsByCategory = useMemo(() => {
    const grouped: Record<string, UserAchievement[]> = {}
    
    Object.keys(categoryInfo).forEach(key => { grouped[key] = [] })
    
    filteredAchievements.forEach(a => {
      const uiKey = mapBackendCategoryToUI(a.category)
      if (grouped[uiKey]) {
        grouped[uiKey].push(a)
      } else {
        if (!grouped['fundamentals']) grouped['fundamentals'] = []
        grouped['fundamentals'].push(a)
      }
    })
    
    return grouped
  }, [filteredAchievements])

  // Helpers for summary cards
  const closestToUnlock = useMemo(() => {
    return allAchievements
      .filter(a => !a.isUnlocked && !a.isSecret)
      .sort((a, b) => (b.completionPercent || 0) - (a.completionPercent || 0))
      .slice(0, 1)
  }, [allAchievements])

  const recentUnlock = useMemo(() => {
    return allAchievements
      .filter(a => a.isUnlocked && a.unlockedAt)
      .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())[0]
  }, [allAchievements])

  if (loading.all && allAchievements.length === 0) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

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
                  <span>
                    {stats?.totalPoints || 0} XP earned
                  </span>
                </div>
                <Badge variant="secondary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {stats?.rank !== "N/A" ? `#${stats?.rank} Global Rank` : "Unranked"}
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
                  <p className="font-semibold truncate w-[150px]">
                    {recentUnlock ? recentUnlock.name : "None yet"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {recentUnlock?.unlockedAt 
                    ? new Date(recentUnlock.unlockedAt).toLocaleDateString() 
                    : "Start trading!"}
                </span>
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
                  <p className="font-semibold truncate w-[150px]">
                    {closestToUnlock[0]?.name || "All unlocked!"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={closestToUnlock[0]?.completionPercent || 0} className="h-2 flex-1" />
                <span className="text-sm font-medium">
                  {closestToUnlock[0] ? `${Math.round(closestToUnlock[0].completionPercent)}%` : "100%"}
                </span>
              </div>
            </CardContent>
          </Card>
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
                
                <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v)}>
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

                <Select value={selectedRarity} onValueChange={(v) => setSelectedRarity(v)}>
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

        {/* Achievement List */}
        <div className="space-y-8">
          {Object.entries(achievementsByCategory).map(([categoryKey, categoryAchievements]) => {
            if (categoryAchievements.length === 0) return null
            
            const info = categoryInfo[categoryKey];
            const unlockedInCategory = categoryAchievements.filter(a => a.isUnlocked).length
            
            return (
              <div key={categoryKey} className="space-y-4">
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
                    <AchievementCard key={achievement.achievementId} achievement={achievement} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}

function AchievementCard({ achievement }: { achievement: UserAchievement }) {
  // Safe access to rarity info, default to common if mismatch
  const rarity = rarityInfo[achievement.rarity.toLowerCase()] || rarityInfo.common;
  const isSecret = achievement.isSecret && !achievement.isUnlocked

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer group",
            rarity.borderColor,
            achievement.isUnlocked && rarity.glow && `shadow-lg ${rarity.glow}`,
            !achievement.isUnlocked && "opacity-75 hover:opacity-100"
          )}
        >
          {/* Legendary Shine */}
          {achievement.rarity === "legendary" && achievement.isUnlocked && (
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5" />
          )}
          
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform group-hover:scale-110",
                  achievement.isUnlocked ? rarity.bgColor : "bg-muted"
                )}
              >
                {isSecret ? "🔒" : (achievement.icon?.length < 5 ? achievement.icon : "🏆")}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={cn(
                    "font-semibold truncate",
                    isSecret && "text-muted-foreground"
                  )}>
                    {isSecret ? "???" : achievement.name}
                  </h3>
                  {achievement.isUnlocked && (
                    <Unlock className="h-4 w-4 text-green-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {isSecret ? "Keep trading to reveal this achievement." : achievement.description}
                </p>
              </div>
            </div>

            {/* Progress & Rewards */}
            <div className="mt-3 space-y-2">
              {!achievement.isUnlocked && !isSecret && (
                <div className="flex items-center gap-2">
                  <Progress value={achievement.completionPercent} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {achievement.progress?.current}/{achievement.progress?.required}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Badge variant="outline" className={cn("text-xs capitalize", rarity.color)}>
                  {rarity.name}
                </Badge>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                    {achievement.pointsReward} XP
                  </Badge>
                </div>
              </div>
            </div>

            {/* Date */}
            {achievement.isUnlocked && achievement.unlockedAt && (
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>

          {/* Shine Animation for Legendary */}
          {achievement.rarity === "legendary" && achievement.isUnlocked && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          )}
        </Card>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[300px]">
        <div className="space-y-1">
          <p className="font-semibold">{isSecret ? "Secret Achievement" : achievement.name}</p>
          <p className="text-sm text-muted-foreground">
            {isSecret ? "Complete hidden requirements to unlock" : achievement.description}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}