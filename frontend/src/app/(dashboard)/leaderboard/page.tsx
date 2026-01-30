"use client"

import { useEffect, useState, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks" 
import { 
  fetchActiveLeagues, 
  fetchLeaderboard, 
  selectLeagueByType 
} from "@/store/slices/leagues.slice"
import { LeagueType } from "@/types/league.types"

import {
  Trophy,
  Crown,
  Flame,
  Target,
  Zap,
  Star,
  Search,
  Loader2,
  TrendingUp
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function LeaderboardPage() {
  const dispatch = useAppDispatch()
  
  // Access Auth User
  const { user } = useAppSelector((state) => state.auth)

  // Access Leagues State
  const { 
    activeLeagues, 
    currentLeague,
    leaderboard, 
    loading, 
    error 
  } = useAppSelector((state) => state.leagues)

  const [searchQuery, setSearchQuery] = useState("")

  // ==========================================
  // 1. INITIAL FETCH
  // ==========================================
  useEffect(() => {
    dispatch(fetchActiveLeagues())
  }, [dispatch])

  // ==========================================
  // 2. FETCH LEADERBOARD ON TAB CHANGE
  // ==========================================
  useEffect(() => {
    if (currentLeague?._id) {
      dispatch(fetchLeaderboard(currentLeague._id))
    }
  }, [dispatch, currentLeague])

  // ==========================================
  // 3. COMPUTED DATA
  // ==========================================
  
  // Filter based on search (Fixed: Added safety checks for missing usernames)
  const filteredLeaderboard = useMemo(() => {
    if (!leaderboard) return [];
    
    return leaderboard.filter((entry) => {
      // Guard against malformed entries where username might be null/undefined
      if (!entry || !entry.username) return false;
      return entry.username.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [leaderboard, searchQuery])

  // Find "You" in the list
  const currentUserEntry = useMemo(() => {
    if (!user || !leaderboard) return null
    return leaderboard.find(entry => entry.userId === user._id)
  }, [leaderboard, user])

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
  }

  // Helper to safely get initials
  const getInitials = (name?: string) => {
    return (name || "??").slice(0, 2).toUpperCase();
  }

  // ==========================================
  // UI RENDER
  // ==========================================

  if (loading && activeLeagues.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <Trophy className="h-12 w-12 text-muted-foreground opacity-50" />
        <p className="text-red-500">Failed to load leaderboard</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            {currentLeague ? currentLeague.name : "Leaderboard"}
          </h1>
          <p className="text-muted-foreground">
            {currentLeague 
              ? `Competition ends: ${new Date(currentLeague.endDate).toLocaleDateString()}` 
              : "Compete with traders worldwide"}
          </p>
        </div>
      </div>

      {/* Your Position Card */}
      {currentUserEntry ? (
        <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-accent/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                      {/* Check specifically for username or name depending on your User type */}
                      {getInitials(user?.name || (user as any)?.name || "ME")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-bold">
                    #{currentUserEntry.rank}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">Your Position</h2>
                    <Badge variant="secondary" className="text-xs">
                      {currentLeague?.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">Keep trading to climb higher!</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className={`text-2xl font-bold ${currentUserEntry.score >= 0 ? "text-accent" : "text-red-500"}`}>
                     {formatCurrency(currentUserEntry.score)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total P&L</p>
                </div>
                <Separator orientation="vertical" className="h-12 hidden md:block" />
                <div className="text-center hidden md:block">
                  <div className="flex items-center gap-1 justify-center text-accent">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 bg-muted/20">
           <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2">
             <Trophy className="h-8 w-8 text-muted-foreground opacity-50" />
             <p className="font-medium text-muted-foreground">
               You haven't joined the {currentLeague?.type.toLowerCase() || 'active'} league yet.
             </p>
             <p className="text-xs text-muted-foreground">
               Place a trade to automatically enter the leaderboard!
             </p>
           </CardContent>
        </Card>
      )}

      {/* League Tabs & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {activeLeagues.length > 0 ? (
          <Tabs 
            value={currentLeague?.type} 
            onValueChange={(val) => dispatch(selectLeagueByType(val as LeagueType))}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
              {activeLeagues.map(league => (
                <TabsTrigger key={league._id} value={league.type}>
                  {league.type.charAt(0) + league.type.slice(1).toLowerCase()}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : (
           <div className="text-sm text-muted-foreground">Loading active leagues...</div>
        )}

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
      {filteredLeaderboard.length > 0 && !loading && (
        <div className="grid gap-4 md:grid-cols-3 mt-8">
          
          {/* 2nd Place */}
          {filteredLeaderboard[1] && (
            <Card className="order-1 md:order-1 bg-gradient-to-b from-slate-400/10 to-transparent border-slate-400/30">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-20 w-20 border-4 border-slate-400">
                    <AvatarFallback className="bg-slate-400/20 text-slate-600 text-2xl font-bold">
                      {getInitials(filteredLeaderboard[1].username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 text-3xl">🥈</div>
                </div>
                <h3 className="font-bold text-lg">{filteredLeaderboard[1].username || "Unknown"}</h3>
                <p className="text-2xl font-bold mt-2 text-slate-600 dark:text-slate-400">
                  {formatCurrency(filteredLeaderboard[1].score)}
                </p>
              </CardContent>
            </Card>
          )}

          {/* 1st Place */}
          {filteredLeaderboard[0] && (
            <Card className="order-0 md:order-2 bg-gradient-to-b from-yellow-500/20 to-transparent border-yellow-500/30 md:-mt-4 shadow-lg shadow-yellow-500/10">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-24 w-24 border-4 border-yellow-500">
                    <AvatarFallback className="bg-yellow-500/20 text-yellow-600 text-3xl font-bold">
                      {getInitials(filteredLeaderboard[0].username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-3 -right-3 text-4xl">👑</div>
                </div>
                <h3 className="font-bold text-xl">{filteredLeaderboard[0].username || "Unknown"}</h3>
                <p className="text-3xl font-bold mt-2 text-yellow-600 dark:text-yellow-400">
                  {formatCurrency(filteredLeaderboard[0].score)}
                </p>
                <Badge className="mt-2 bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30">
                  Top Trader
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* 3rd Place */}
          {filteredLeaderboard[2] && (
            <Card className="order-2 md:order-3 bg-gradient-to-b from-orange-500/10 to-transparent border-orange-500/30">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-20 w-20 border-4 border-orange-500">
                    <AvatarFallback className="bg-orange-500/20 text-orange-600 text-2xl font-bold">
                      {getInitials(filteredLeaderboard[2].username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 text-3xl">🥉</div>
                </div>
                <h3 className="font-bold text-lg">{filteredLeaderboard[2].username || "Unknown"}</h3>
                <p className="text-2xl font-bold mt-2 text-orange-600 dark:text-orange-400">
                  {formatCurrency(filteredLeaderboard[2].score)}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
          <CardDescription>
            Live profit/loss standings for {currentLeague?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {loading ? (
              // Skeleton Loader
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                  <Skeleton className="h-8 w-20 ml-auto" />
                </div>
              ))
            ) : (
              filteredLeaderboard.map((player) => (
                <div
                  key={player.userId || Math.random()} // Fallback key if userId is missing
                  className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                    player.userId === user?._id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Number */}
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold ${
                        player.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                        player.rank === 2 ? "bg-slate-400/20 text-slate-500" :
                        player.rank === 3 ? "bg-orange-500/20 text-orange-500" :
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {player.rank <= 3 ? ["🥇", "🥈", "🥉"][player.rank - 1] : player.rank}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-muted text-sm font-medium">
                          {getInitials(player.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{player.username || "Unknown User"}</p>
                          {player.userId === user?._id && (
                            <Badge variant="secondary" className="text-[10px] h-5 px-1">You</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Right */}
                  <div className="flex items-center gap-6">
                    {/* Visual Fluff */}
                    <div className="hidden lg:block text-center min-w-[50px] opacity-50">
                       <Zap className="h-4 w-4 mx-auto text-yellow-500" />
                    </div>

                    <div className="text-right min-w-[100px]">
                      <p className={`font-bold ${player.score >= 0 ? "text-accent" : "text-red-500"}`}>
                        {formatCurrency(player.score)}
                      </p>
                      <p className="text-xs text-muted-foreground">P&L</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {!loading && filteredLeaderboard.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Trophy className="h-12 w-12 mb-4 opacity-50" />
              <p className="font-medium">No active traders found</p>
              <p className="text-sm">Be the first to join this league!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-yellow-500/10 p-3">
                <Crown className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Performer</p>
                <p className="font-bold">
                  {filteredLeaderboard.length > 0 ? (filteredLeaderboard[0].username || "Unknown") : "-"}
                </p>
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
                <p className="font-bold">{filteredLeaderboard.length > 0 ? "5 Days" : "-"}</p>
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
                <p className="font-bold">{filteredLeaderboard.length > 0 ? "82%" : "-"}</p>
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
                <p className="font-bold">{filteredLeaderboard.length > 0 ? "42 Trades" : "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}