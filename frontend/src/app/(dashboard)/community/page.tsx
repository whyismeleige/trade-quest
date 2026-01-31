"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Send,
  Image as ImageIcon,
  BarChart3,
  Trophy,
  Flame,
  Users,
  Eye,
  Filter,
  Sparkles,
  Zap,
  Hash,
  Link2,
  Flag,
  UserPlus,
  Check,
  Bell,
  MessageSquare,
  Repeat2,
  ArrowUp,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
interface Post {
  id: string
  author: {
    name: string
    username: string
    avatar: string
    level: number
    badge?: string
    isVerified?: boolean
  }
  content: string
  trade?: {
    symbol: string
    action: "buy" | "sell"
    price: number
    gain?: number
    shares?: number
  }
  image?: string
  likes: number
  comments: number
  shares: number
  views: number
  timestamp: string
  isLiked: boolean
  isBookmarked: boolean
  tags?: string[]
}

interface TrendingTopic {
  id: string
  tag: string
  posts: number
  trend: "up" | "down" | "stable"
  change: number
}

interface TopTrader {
  id: string
  name: string
  username: string
  avatar: string
  level: number
  badge: string
  winRate: number
  followers: number
  isFollowing: boolean
}

// Sample Data
const posts: Post[] = [
  {
    id: "1",
    author: {
      name: "Alex Thompson",
      username: "alextrader",
      avatar: "/avatars/alex.png",
      level: 45,
      badge: "Diamond",
      isVerified: true,
    },
    content: "Just closed my ₹NVDA position after holding for 3 weeks. The AI rally is real! 🚀 Remember: patience pays. Don't chase, wait for your setups.",
    trade: {
      symbol: "NVDA",
      action: "sell",
      price: 875.50,
      gain: 23.5,
      shares: 50,
    },
    likes: 342,
    comments: 56,
    shares: 28,
    views: 4521,
    timestamp: "2h ago",
    isLiked: false,
    isBookmarked: false,
    tags: ["NVDA", "AI", "TechStocks"],
  },
  {
    id: "2",
    author: {
      name: "Sarah Chen",
      username: "sarahswings",
      avatar: "/avatars/sarah.png",
      level: 38,
      badge: "Platinum",
    },
    content: "My watchlist for next week:\n\n📊 $AAPL - Earnings play\n📊 $TSLA - Support at 240\n📊 $AMD - Breakout potential\n\nWhat's on yours? Drop your picks below! 👇",
    likes: 189,
    comments: 87,
    shares: 15,
    views: 2834,
    timestamp: "4h ago",
    isLiked: true,
    isBookmarked: true,
    tags: ["Watchlist", "WeeklyPicks"],
  },
  {
    id: "3",
    author: {
      name: "Mike Rodriguez",
      username: "mikethetrader",
      avatar: "/avatars/mike.png",
      level: 52,
      badge: "Master",
      isVerified: true,
    },
    content: "🎓 Quick tip for new traders:\n\nNever risk more than 2% of your portfolio on a single trade. This saved me countless times during my journey.\n\nRisk management > Everything else",
    likes: 567,
    comments: 43,
    shares: 124,
    views: 8932,
    timestamp: "6h ago",
    isLiked: false,
    isBookmarked: true,
    tags: ["Education", "RiskManagement", "Tips"],
  },
  {
    id: "4",
    author: {
      name: "Emma Wilson",
      username: "emmainvests",
      avatar: "/avatars/emma.png",
      level: 29,
      badge: "Gold",
    },
    content: "First 5-figure month! 🎉 Started with $2,000 six months ago. The compound effect is incredible. Thanks to this amazing community for all the knowledge shared!",
    trade: {
      symbol: "Portfolio",
      action: "buy",
      price: 12450,
      gain: 15.2,
    },
    likes: 892,
    comments: 156,
    shares: 67,
    views: 12453,
    timestamp: "8h ago",
    isLiked: true,
    isBookmarked: false,
    tags: ["Milestone", "Success"],
  },
  {
    id: "5",
    author: {
      name: "David Park",
      username: "davidp",
      avatar: "/avatars/david.png",
      level: 41,
      badge: "Diamond",
    },
    content: "Bearish on $META short-term. The chart is showing classic distribution pattern. Set my stop at 515. Let's see how this plays out. 📉\n\nRemember: the trend is your friend until it ends.",
    trade: {
      symbol: "META",
      action: "sell",
      price: 498.25,
      shares: 30,
    },
    likes: 234,
    comments: 89,
    shares: 23,
    views: 3421,
    timestamp: "10h ago",
    isLiked: false,
    isBookmarked: false,
    tags: ["META", "ShortTerm", "TechnicalAnalysis"],
  },
]

const trendingTopics: TrendingTopic[] = [
  { id: "1", tag: "NVDA", posts: 1243, trend: "up", change: 45 },
  { id: "2", tag: "EarningsSeason", posts: 892, trend: "up", change: 23 },
  { id: "3", tag: "TechStocks", posts: 756, trend: "stable", change: 2 },
  { id: "4", tag: "SwingTrading", posts: 634, trend: "up", change: 18 },
  { id: "5", tag: "RiskManagement", posts: 521, trend: "down", change: -5 },
  { id: "6", tag: "Options", posts: 489, trend: "up", change: 12 },
]

const topTraders: TopTrader[] = [
  {
    id: "1",
    name: "Alex Thompson",
    username: "alextrader",
    avatar: "/avatars/alex.png",
    level: 45,
    badge: "Diamond",
    winRate: 78,
    followers: 12453,
    isFollowing: true,
  },
  {
    id: "2",
    name: "Mike Rodriguez",
    username: "mikethetrader",
    avatar: "/avatars/mike.png",
    level: 52,
    badge: "Master",
    winRate: 82,
    followers: 28934,
    isFollowing: false,
  },
  {
    id: "3",
    name: "Jessica Lee",
    username: "jessicatrades",
    avatar: "/avatars/jessica.png",
    level: 48,
    badge: "Diamond",
    winRate: 75,
    followers: 9823,
    isFollowing: false,
  },
  {
    id: "4",
    name: "Ryan Kumar",
    username: "ryankumar",
    avatar: "/avatars/ryan.png",
    level: 39,
    badge: "Platinum",
    winRate: 71,
    followers: 6754,
    isFollowing: true,
  },
]

// Helper functions
const getBadgeColor = (badge: string) => {
  switch (badge.toLowerCase()) {
    case "master":
      return "bg-gradient-to-r from-red-500 to-orange-500 text-white"
    case "diamond":
      return "bg-gradient-to-r from-cyan-400 to-blue-500 text-white"
    case "platinum":
      return "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
    case "gold":
      return "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export default function CommunityPage() {
  const [postContent, setPostContent] = useState("")
  const [likedPosts, setLikedPosts] = useState<string[]>(
    posts.filter((p) => p.isLiked).map((p) => p.id)
  )
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>(
    posts.filter((p) => p.isBookmarked).map((p) => p.id)
  )
  const [following, setFollowing] = useState<string[]>(
    topTraders.filter((t) => t.isFollowing).map((t) => t.id)
  )

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    )
  }

  const toggleBookmark = (postId: string) => {
    setBookmarkedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    )
  }

  const toggleFollow = (traderId: string) => {
    setFollowing((prev) =>
      prev.includes(traderId)
        ? prev.filter((id) => id !== traderId)
        : [...prev, traderId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">
            Connect with traders, share insights, and learn together
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </Button>
          <Button size="sm" className="gap-2">
            <Users className="h-4 w-4" />
            Find Traders
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Traders</p>
                <p className="text-xl font-bold">12,453</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <MessageSquare className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Posts Today</p>
                <p className="text-xl font-bold">2,847</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Trades Shared</p>
                <p className="text-xl font-bold">8,932</p>
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
                <p className="text-xs text-muted-foreground">Your Streak</p>
                <p className="text-xl font-bold">5 Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Feed Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/avatars/user.png" />
                  <AvatarFallback className="bg-primary/10 text-primary">PJ</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Share your trade, insight, or ask a question..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Image</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <BarChart3 className="h-4 w-4" />
                        <span className="hidden sm:inline">Trade</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Hash className="h-4 w-4" />
                        <span className="hidden sm:inline">Tag</span>
                      </Button>
                    </div>
                    <Button size="sm" disabled={!postContent.trim()} className="gap-2">
                      <Send className="h-4 w-4" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feed Tabs */}
          <Tabs defaultValue="feed" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="feed" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  For You
                </TabsTrigger>
                <TabsTrigger value="following" className="gap-2">
                  <Users className="h-4 w-4" />
                  Following
                </TabsTrigger>
                <TabsTrigger value="trending" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending
                </TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            <TabsContent value="feed" className="space-y-4 mt-0">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isLiked={likedPosts.includes(post.id)}
                  isBookmarked={bookmarkedPosts.includes(post.id)}
                  onLike={() => toggleLike(post.id)}
                  onBookmark={() => toggleBookmark(post.id)}
                />
              ))}
            </TabsContent>

            <TabsContent value="following" className="space-y-4 mt-0">
              {posts.slice(0, 3).map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isLiked={likedPosts.includes(post.id)}
                  isBookmarked={bookmarkedPosts.includes(post.id)}
                  onLike={() => toggleLike(post.id)}
                  onBookmark={() => toggleBookmark(post.id)}
                />
              ))}
            </TabsContent>

            <TabsContent value="trending" className="space-y-4 mt-0">
              {posts
                .sort((a, b) => b.likes - a.likes)
                .map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    isLiked={likedPosts.includes(post.id)}
                    isBookmarked={bookmarkedPosts.includes(post.id)}
                    onLike={() => toggleLike(post.id)}
                    onBookmark={() => toggleBookmark(post.id)}
                  />
                ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-4">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">#{topic.tag}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatNumber(topic.posts)} posts
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      topic.trend === "up" && "text-green-500",
                      topic.trend === "down" && "text-red-500",
                      topic.trend === "stable" && "text-muted-foreground"
                    )}
                  >
                    {topic.trend === "up" && <ArrowUp className="h-3 w-3" />}
                    {topic.trend === "down" && <TrendingDown className="h-3 w-3" />}
                    {topic.change > 0 ? "+" : ""}
                    {topic.change}%
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Traders */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top Traders
              </CardTitle>
              <CardDescription>This week&apos;s best performers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topTraders.map((trader, index) => (
                <div key={trader.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={trader.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {trader.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {index < 3 && (
                        <div
                          className={cn(
                            "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                            index === 0 && "bg-yellow-500 text-yellow-950",
                            index === 1 && "bg-slate-400 text-slate-950",
                            index === 2 && "bg-amber-600 text-amber-950"
                          )}
                        >
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{trader.name}</p>
                        <Badge className={cn("text-[10px] px-1.5", getBadgeColor(trader.badge))}>
                          {trader.badge}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{trader.winRate}% win</span>
                        <span>•</span>
                        <span>{formatNumber(trader.followers)} followers</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant={following.includes(trader.id) ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => toggleFollow(trader.id)}
                    className="h-8"
                  >
                    {following.includes(trader.id) ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3 w-3 mr-1" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>
              ))}
              <Button variant="ghost" className="w-full" size="sm">
                View All Traders
              </Button>
            </CardContent>
          </Card>

          {/* Your Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                Your Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">89</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">34</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">1.2K</p>
                  <p className="text-xs text-muted-foreground">Total Likes</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Community XP</span>
                </div>
                <span className="font-semibold">+245 today</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                <Bookmark className="h-4 w-4" />
                Saved Posts
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                <MessageCircle className="h-4 w-4" />
                Your Comments
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                <Heart className="h-4 w-4" />
                Liked Posts
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                <Users className="h-4 w-4" />
                Your Network
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Post Card Component
function PostCard({
  post,
  isLiked,
  isBookmarked,
  onLike,
  onBookmark,
}: {
  post: Post
  isLiked: boolean
  isBookmarked: boolean
  onLike: () => void
  onBookmark: () => void
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Author Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{post.author.name}</span>
                {post.author.isVerified && (
                  <Badge variant="secondary" className="h-4 px-1">
                    <Check className="h-3 w-3" />
                  </Badge>
                )}
                {post.author.badge && (
                  <Badge className={cn("text-[10px] px-1.5", getBadgeColor(post.author.badge))}>
                    {post.author.badge}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>@{post.author.username}</span>
                <span>•</span>
                <span>Lvl {post.author.level}</span>
                <span>•</span>
                <span>{post.timestamp}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link2 className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserPlus className="h-4 w-4 mr-2" />
                Follow @{post.author.username}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                <Flag className="h-4 w-4 mr-2" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <p className="text-sm whitespace-pre-line mb-3">{post.content}</p>

        {/* Trade Card */}
        {post.trade && (
          <div
            className={cn(
              "p-3 rounded-lg border mb-3",
              post.trade.action === "buy"
                ? "bg-green-500/5 border-green-500/20"
                : "bg-red-500/5 border-red-500/20"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    post.trade.action === "buy" ? "bg-green-500/10" : "bg-red-500/10"
                  )}
                >
                  {post.trade.action === "buy" ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">${post.trade.symbol}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        post.trade.action === "buy"
                          ? "border-green-500/30 text-green-500"
                          : "border-red-500/30 text-red-500"
                      )}
                    >
                      {post.trade.action.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    @ ${post.trade.price.toLocaleString()}
                    {post.trade.shares && ` • ${post.trade.shares} shares`}
                  </p>
                </div>
              </div>
              {post.trade.gain !== undefined && (
                <div
                  className={cn(
                    "text-right",
                    post.trade.gain >= 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  <p className="font-bold">
                    {post.trade.gain >= 0 ? "+" : ""}
                    {post.trade.gain}%
                  </p>
                  <p className="text-xs">P/L</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn("gap-2 h-8", isLiked && "text-red-500")}
              onClick={onLike}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              <span className="text-xs">{formatNumber(post.likes + (isLiked ? 1 : 0))}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 h-8">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{formatNumber(post.comments)}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 h-8">
              <Repeat2 className="h-4 w-4" />
              <span className="text-xs">{formatNumber(post.shares)}</span>
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mr-2">
              <Eye className="h-3 w-3" />
              {formatNumber(post.views)}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", isBookmarked && "text-primary")}
              onClick={onBookmark}
            >
              <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
