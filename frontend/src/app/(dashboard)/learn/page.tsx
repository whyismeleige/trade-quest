"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  Play,
  Clock,
  Star,
  Trophy,
  Zap,
  Lock,
  CheckCircle2,
  ChevronRight,
  Search,
  Filter,
  TrendingUp,
  BarChart3,
  Target,
  Shield,
  Brain,
  Lightbulb,
  GraduationCap,
  Award,
  Flame,
  Users,
  PlayCircle,
  FileText,
  Video,
  Headphones,
  BookMarked,
  Sparkles,
  ArrowRight,
  Timer,
  CircleDot,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
interface Course {
  id: string
  title: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string
  lessons: number
  completedLessons: number
  xpReward: number
  image: string
  instructor: string
  rating: number
  students: number
  tags: string[]
  isLocked: boolean
  isFeatured?: boolean
}

interface Lesson {
  id: string
  title: string
  duration: string
  type: "video" | "article" | "quiz" | "exercise"
  isCompleted: boolean
  isLocked: boolean
  xpReward: number
}

interface LearningPath {
  id: string
  title: string
  description: string
  courses: number
  completedCourses: number
  totalXp: number
  icon: React.ReactNode
  color: string
}

// Sample Data
const courses: Course[] = [
  {
    id: "1",
    title: "Trading Fundamentals 101",
    description: "Master the basics of stock trading, market orders, and portfolio management.",
    category: "Fundamentals",
    difficulty: "beginner",
    duration: "2h 30m",
    lessons: 12,
    completedLessons: 12,
    xpReward: 500,
    image: "/courses/fundamentals.jpg",
    instructor: "Alex Thompson",
    rating: 4.9,
    students: 12453,
    tags: ["Basics", "Stocks", "Orders"],
    isLocked: false,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Technical Analysis Mastery",
    description: "Learn to read charts, identify patterns, and use technical indicators effectively.",
    category: "Technical Analysis",
    difficulty: "intermediate",
    duration: "4h 15m",
    lessons: 18,
    completedLessons: 8,
    xpReward: 1000,
    image: "/courses/technical.jpg",
    instructor: "Sarah Chen",
    rating: 4.8,
    students: 8932,
    tags: ["Charts", "Patterns", "Indicators"],
    isLocked: false,
  },
  {
    id: "3",
    title: "Risk Management Essentials",
    description: "Protect your portfolio with proven risk management strategies and position sizing.",
    category: "Risk Management",
    difficulty: "intermediate",
    duration: "3h 00m",
    lessons: 15,
    completedLessons: 0,
    xpReward: 750,
    image: "/courses/risk.jpg",
    instructor: "Mike Rodriguez",
    rating: 4.9,
    students: 7654,
    tags: ["Risk", "Position Sizing", "Stop Loss"],
    isLocked: false,
  },
  {
    id: "4",
    title: "Options Trading Fundamentals",
    description: "Understand calls, puts, and basic options strategies for income and hedging.",
    category: "Options",
    difficulty: "intermediate",
    duration: "5h 30m",
    lessons: 24,
    completedLessons: 0,
    xpReward: 1500,
    image: "/courses/options.jpg",
    instructor: "Emma Wilson",
    rating: 4.7,
    students: 5432,
    tags: ["Options", "Calls", "Puts"],
    isLocked: false,
  },
  {
    id: "5",
    title: "Advanced Chart Patterns",
    description: "Deep dive into complex chart patterns and how to trade them profitably.",
    category: "Technical Analysis",
    difficulty: "advanced",
    duration: "3h 45m",
    lessons: 16,
    completedLessons: 0,
    xpReward: 1200,
    image: "/courses/patterns.jpg",
    instructor: "David Park",
    rating: 4.8,
    students: 3421,
    tags: ["Patterns", "Advanced", "Trading"],
    isLocked: true,
  },
  {
    id: "6",
    title: "Trading Psychology",
    description: "Master your emotions and develop the mindset of a successful trader.",
    category: "Psychology",
    difficulty: "beginner",
    duration: "2h 00m",
    lessons: 10,
    completedLessons: 5,
    xpReward: 400,
    image: "/courses/psychology.jpg",
    instructor: "Jessica Lee",
    rating: 4.9,
    students: 9876,
    tags: ["Psychology", "Mindset", "Emotions"],
    isLocked: false,
  },
  {
    id: "7",
    title: "Swing Trading Strategies",
    description: "Learn to capture medium-term price movements with swing trading techniques.",
    category: "Strategies",
    difficulty: "intermediate",
    duration: "4h 00m",
    lessons: 20,
    completedLessons: 0,
    xpReward: 1000,
    image: "/courses/swing.jpg",
    instructor: "Ryan Kumar",
    rating: 4.6,
    students: 4567,
    tags: ["Swing Trading", "Strategies"],
    isLocked: false,
  },
  {
    id: "8",
    title: "Algorithmic Trading Basics",
    description: "Introduction to automated trading systems and algorithmic strategies.",
    category: "Advanced",
    difficulty: "advanced",
    duration: "6h 00m",
    lessons: 28,
    completedLessons: 0,
    xpReward: 2000,
    image: "/courses/algo.jpg",
    instructor: "Alex Thompson",
    rating: 4.7,
    students: 2345,
    tags: ["Algorithms", "Automation", "Systems"],
    isLocked: true,
  },
]

const currentCourse = {
  id: "2",
  title: "Technical Analysis Mastery",
  lessons: [
    { id: "1", title: "Introduction to Technical Analysis", duration: "12:30", type: "video" as const, isCompleted: true, isLocked: false, xpReward: 50 },
    { id: "2", title: "Understanding Candlestick Charts", duration: "18:45", type: "video" as const, isCompleted: true, isLocked: false, xpReward: 50 },
    { id: "3", title: "Support and Resistance Levels", duration: "15:20", type: "video" as const, isCompleted: true, isLocked: false, xpReward: 50 },
    { id: "4", title: "Trend Lines and Channels", duration: "14:10", type: "video" as const, isCompleted: true, isLocked: false, xpReward: 50 },
    { id: "5", title: "Quiz: Chart Basics", duration: "10 questions", type: "quiz" as const, isCompleted: true, isLocked: false, xpReward: 100 },
    { id: "6", title: "Moving Averages Explained", duration: "20:00", type: "video" as const, isCompleted: true, isLocked: false, xpReward: 50 },
    { id: "7", title: "RSI and MACD Indicators", duration: "22:15", type: "video" as const, isCompleted: true, isLocked: false, xpReward: 50 },
    { id: "8", title: "Bollinger Bands Strategy", duration: "16:40", type: "video" as const, isCompleted: true, isLocked: false, xpReward: 50 },
    { id: "9", title: "Practice Exercise: Identify Patterns", duration: "30 min", type: "exercise" as const, isCompleted: false, isLocked: false, xpReward: 150 },
    { id: "10", title: "Volume Analysis", duration: "18:30", type: "video" as const, isCompleted: false, isLocked: false, xpReward: 50 },
    { id: "11", title: "Chart Pattern Recognition", duration: "25:00", type: "video" as const, isCompleted: false, isLocked: true, xpReward: 50 },
    { id: "12", title: "Final Assessment", duration: "20 questions", type: "quiz" as const, isCompleted: false, isLocked: true, xpReward: 200 },
  ],
}

const learningPaths: LearningPath[] = [
  {
    id: "1",
    title: "Complete Beginner",
    description: "Start your trading journey from zero",
    courses: 5,
    completedCourses: 2,
    totalXp: 3000,
    icon: <GraduationCap className="h-6 w-6" />,
    color: "bg-green-500",
  },
  {
    id: "2",
    title: "Technical Trader",
    description: "Master charts and technical analysis",
    courses: 6,
    completedCourses: 1,
    totalXp: 5000,
    icon: <BarChart3 className="h-6 w-6" />,
    color: "bg-blue-500",
  },
  {
    id: "3",
    title: "Risk Manager",
    description: "Learn to protect your capital",
    courses: 4,
    completedCourses: 0,
    totalXp: 2500,
    icon: <Shield className="h-6 w-6" />,
    color: "bg-orange-500",
  },
  {
    id: "4",
    title: "Options Expert",
    description: "Advanced options strategies",
    courses: 8,
    completedCourses: 0,
    totalXp: 8000,
    icon: <Target className="h-6 w-6" />,
    color: "bg-purple-500",
  },
]

const quickTips = [
  { id: "1", title: "Never risk more than 2% per trade", category: "Risk" },
  { id: "2", title: "Always set a stop-loss before entering", category: "Risk" },
  { id: "3", title: "The trend is your friend", category: "Technical" },
  { id: "4", title: "Don't chase trades, wait for setups", category: "Psychology" },
  { id: "5", title: "Keep a trading journal", category: "Discipline" },
]

// Helper functions
const getDifficultyColor = (difficulty: Course["difficulty"]) => {
  switch (difficulty) {
    case "beginner":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "intermediate":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "advanced":
      return "bg-red-500/10 text-red-500 border-red-500/20"
  }
}

const getTypeIcon = (type: Lesson["type"]) => {
  switch (type) {
    case "video":
      return <Video className="h-4 w-4" />
    case "article":
      return <FileText className="h-4 w-4" />
    case "quiz":
      return <Brain className="h-4 w-4" />
    case "exercise":
      return <Target className="h-4 w-4" />
  }
}

const formatNumber = (num: number): string => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "Fundamentals", "Technical Analysis", "Risk Management", "Options", "Psychology", "Strategies", "Advanced"]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalXpEarned = courses.reduce((acc, course) => {
    const progress = course.completedLessons / course.lessons
    return acc + Math.floor(course.xpReward * progress)
  }, 0)

  const completedCourses = courses.filter((c) => c.completedLessons === c.lessons).length
  const inProgressCourses = courses.filter((c) => c.completedLessons > 0 && c.completedLessons < c.lessons).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learn</h1>
          <p className="text-muted-foreground">
            Master trading skills and earn XP with our courses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-xs text-muted-foreground">XP Earned</p>
                <p className="text-lg font-bold">{totalXpEarned.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-lg font-bold">{completedCourses} Courses</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Continue Learning Banner */}
      {inProgressCourses > 0 && (
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20">
                  <PlayCircle className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Continue where you left off</p>
                  <h3 className="text-lg font-semibold">{currentCourse.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Lesson 9: Practice Exercise: Identify Patterns
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">8/18 lessons</p>
                  <Progress value={(8 / 18) * 100} className="h-2 w-32 mt-1" />
                </div>
                <Button className="gap-2">
                  <Play className="h-4 w-4" />
                  Continue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="courses" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Courses</span>
          </TabsTrigger>
          <TabsTrigger value="paths" className="gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Learning Paths</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">My Progress</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <ScrollArea className="w-full sm:w-auto">
              <div className="flex gap-2 pb-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category === "all" ? "All Courses" : category}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Featured Course */}
          {selectedCategory === "all" && !searchQuery && (
            <Card className="overflow-hidden bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border-yellow-500/20">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                      <Badge variant="outline" className={getDifficultyColor("beginner")}>
                        Beginner
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Trading Fundamentals 101</h3>
                    <p className="text-muted-foreground mb-4">
                      Master the basics of stock trading, market orders, and portfolio management. Perfect for beginners starting their trading journey.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        2h 30m
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        12 lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {formatNumber(12453)} students
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        4.9
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button className="gap-2">
                        <Play className="h-4 w-4" />
                        Start Course
                      </Button>
                      <div className="flex items-center gap-1 text-sm">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">500 XP</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                    <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500">
                      <GraduationCap className="h-16 w-16 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>

        {/* Learning Paths Tab */}
        <TabsContent value="paths" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {learningPaths.map((path) => (
              <Card key={path.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl text-white", path.color)}>
                      {path.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{path.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{path.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {path.courses} courses
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          {path.totalXp.toLocaleString()} XP
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{path.completedCourses}/{path.courses} completed</span>
                          <span className="font-medium">{Math.round((path.completedCourses / path.courses) * 100)}%</span>
                        </div>
                        <Progress value={(path.completedCourses / path.courses) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4 gap-2">
                    {path.completedCourses > 0 ? "Continue Path" : "Start Path"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-xl font-bold">{completedCourses} Courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <PlayCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                    <p className="text-xl font-bold">{inProgressCourses} Courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                    <Zap className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total XP</p>
                    <p className="text-xl font-bold">{totalXpEarned.toLocaleString()}</p>
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
                    <p className="text-xs text-muted-foreground">Learning Streak</p>
                    <p className="text-xl font-bold">5 Days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {currentCourse.title}
              </CardTitle>
              <CardDescription>Your current course progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentCourse.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-lg border transition-colors",
                      lesson.isCompleted && "bg-green-500/5 border-green-500/20",
                      !lesson.isCompleted && !lesson.isLocked && "hover:bg-muted/50 cursor-pointer",
                      lesson.isLocked && "opacity-50"
                    )}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {lesson.isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : lesson.isLocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn("font-medium", lesson.isCompleted && "text-green-600 dark:text-green-400")}>
                          {lesson.title}
                        </span>
                        {getTypeIcon(lesson.type)}
                      </div>
                      <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs">
                        <Zap className="h-3 w-3 text-yellow-500" />
                        {lesson.xpReward} XP
                      </div>
                      {!lesson.isLocked && !lesson.isCompleted && (
                        <Button size="sm" variant="ghost">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Quick Trading Tips
                </CardTitle>
                <CardDescription>Essential knowledge for every trader</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickTips.map((tip, index) => (
                  <div key={tip.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{tip.title}</p>
                      <Badge variant="secondary" className="text-xs mt-1">{tip.category}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Resource Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-blue-500" />
                  Additional Resources
                </CardTitle>
                <CardDescription>Helpful materials and guides</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium">Trading Glossary</p>
                    <p className="text-xs text-muted-foreground">100+ terms explained</p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Video className="h-5 w-5 text-red-500" />
                  <div className="text-left">
                    <p className="font-medium">Video Library</p>
                    <p className="text-xs text-muted-foreground">50+ tutorial videos</p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Headphones className="h-5 w-5 text-purple-500" />
                  <div className="text-left">
                    <p className="font-medium">Trading Podcast</p>
                    <p className="text-xs text-muted-foreground">Weekly market insights</p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  <div className="text-left">
                    <p className="font-medium">Chart Pattern Cheatsheet</p>
                    <p className="text-xs text-muted-foreground">Download PDF</p>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Learning Achievements
                </CardTitle>
                <CardDescription>Unlock badges by completing courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 mb-2">
                      <GraduationCap className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="font-medium text-sm">First Steps</p>
                    <p className="text-xs text-muted-foreground">Complete 1 course</p>
                    <Badge className="mt-2 bg-green-500/20 text-green-500">Unlocked</Badge>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 mb-2">
                      <Brain className="h-6 w-6 text-blue-500" />
                    </div>
                    <p className="font-medium text-sm">Quick Learner</p>
                    <p className="text-xs text-muted-foreground">Complete 5 courses</p>
                    <Badge variant="outline" className="mt-2">3/5</Badge>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50 text-center opacity-50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 mb-2">
                      <Sparkles className="h-6 w-6 text-purple-500" />
                    </div>
                    <p className="font-medium text-sm">Knowledge Seeker</p>
                    <p className="text-xs text-muted-foreground">Complete 10 courses</p>
                    <Badge variant="outline" className="mt-2">
                      <Lock className="h-3 w-3 mr-1" />
                      Locked
                    </Badge>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50 text-center opacity-50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 mb-2">
                      <Trophy className="h-6 w-6 text-amber-500" />
                    </div>
                    <p className="font-medium text-sm">Master Trader</p>
                    <p className="text-xs text-muted-foreground">Complete all courses</p>
                    <Badge variant="outline" className="mt-2">
                      <Lock className="h-3 w-3 mr-1" />
                      Locked
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Course Card Component
function CourseCard({ course }: { course: Course }) {
  const progressPercent = (course.completedLessons / course.lessons) * 100
  const isCompleted = course.completedLessons === course.lessons
  const isInProgress = course.completedLessons > 0 && !isCompleted

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", course.isLocked && "opacity-60")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="outline" className={getDifficultyColor(course.difficulty)}>
            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
          </Badge>
          {course.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
          {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-500" />}
        </div>

        <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {course.lessons} lessons
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            {course.rating}
          </div>
        </div>

        {isInProgress && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>{course.completedLessons}/{course.lessons} completed</span>
              <span className="font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold">{course.xpReward} XP</span>
          </div>
          <Button size="sm" disabled={course.isLocked} variant={isInProgress ? "default" : "outline"}>
            {course.isLocked ? (
              <>
                <Lock className="h-3 w-3 mr-1" />
                Locked
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Review
              </>
            ) : isInProgress ? (
              <>
                <Play className="h-3 w-3 mr-1" />
                Continue
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-1" />
                Start
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
