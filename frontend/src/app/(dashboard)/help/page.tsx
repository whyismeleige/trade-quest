"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  HelpCircle,
  Search,
  MessageCircle,
  Mail,
  Book,
  Video,
  FileText,
  ExternalLink,
  ChevronRight,
  Zap,
  TrendingUp,
  Shield,
  Trophy,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  Wallet,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Headphones,
  MessageSquare,
  Lightbulb,
  BookOpen,
  PlayCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  helpful?: number
}

interface GuideItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  duration: string
  type: "video" | "article"
  category: string
}

interface SupportTicket {
  id: string
  subject: string
  status: "open" | "in-progress" | "resolved"
  date: string
  lastUpdate: string
}

// FAQ Data
const faqItems: FAQItem[] = [
  {
    id: "1",
    question: "How do I start trading on TradeQuest?",
    answer: "To start trading, first complete your profile setup and verify your account. Then, navigate to the Trading page from the sidebar. You can search for stocks, view their charts and details, and place buy/sell orders. We recommend starting with our Learn section to understand the basics before making your first trade.",
    category: "Getting Started",
    helpful: 234,
  },
  {
    id: "2",
    question: "What is virtual currency and how does it work?",
    answer: "TradeQuest uses virtual currency for paper trading, allowing you to practice trading without risking real money. You start with $100,000 in virtual funds. All trades, profits, and losses are simulated. This is perfect for learning trading strategies and building confidence before moving to real markets.",
    category: "Getting Started",
    helpful: 189,
  },
  {
    id: "3",
    question: "How do I earn XP and level up?",
    answer: "You earn XP through various activities: completing trades (+10-25 XP), finishing courses (+50-200 XP), achieving daily challenges (+50-200 XP), maintaining login streaks (+25 XP/day), and engaging with the community (+2-15 XP). As you accumulate XP, you'll level up and unlock new features, badges, and rewards.",
    category: "Gamification",
    helpful: 312,
  },
  {
    id: "4",
    question: "What are achievements and how do I unlock them?",
    answer: "Achievements are special milestones that reward your trading journey. They range from simple tasks like 'First Trade' to complex challenges like 'Diamond Hands' (holding for 30 days). Each achievement grants XP, coins, and sometimes exclusive titles. Check the Achievements page to see all available achievements and your progress.",
    category: "Gamification",
    helpful: 156,
  },
  {
    id: "5",
    question: "How does the leaderboard ranking work?",
    answer: "The leaderboard ranks traders based on their portfolio performance (percentage gain), XP earned, and achievement points. Rankings are calculated daily, weekly, monthly, and all-time. Top performers receive special badges and rewards. You can choose to appear anonymously or opt out entirely in Privacy settings.",
    category: "Gamification",
    helpful: 198,
  },
  {
    id: "6",
    question: "What order types are available?",
    answer: "TradeQuest supports several order types: Market Orders (execute immediately at current price), Limit Orders (execute at your specified price or better), Stop Orders (trigger when price reaches a level), and Stop-Limit Orders (combination of stop and limit). Each type has its use case depending on your trading strategy.",
    category: "Trading",
    helpful: 267,
  },
  {
    id: "7",
    question: "How do I set up price alerts?",
    answer: "To set price alerts, go to any stock's detail page and click the 'Set Alert' button. You can set alerts for specific price levels, percentage changes, or volume spikes. Alerts can be delivered via push notification, email, or both. Manage all your alerts from the Settings > Notifications page.",
    category: "Trading",
    helpful: 145,
  },
  {
    id: "8",
    question: "What is a stop-loss and how do I use it?",
    answer: "A stop-loss is an order that automatically sells your position when the price drops to a specified level, limiting your potential loss. For example, if you buy a stock at $100 and set a stop-loss at $95, your position will automatically sell if the price falls to $95. This is a crucial risk management tool.",
    category: "Trading",
    helpful: 289,
  },
  {
    id: "9",
    question: "How do I read candlestick charts?",
    answer: "Candlestick charts show price movement over time. Each candle has a body (open-close range) and wicks (high-low range). Green/white candles indicate price went up (close > open), red/black indicate price went down (close < open). The Learn section has detailed courses on chart reading and technical analysis.",
    category: "Learning",
    helpful: 356,
  },
  {
    id: "10",
    question: "Can I follow other traders?",
    answer: "Yes! You can follow other traders to see their public trades and insights in your Community feed. Go to any trader's profile and click 'Follow'. You can also view top traders on the Leaderboard and follow them directly. Note: Following doesn't copy their trades automatically.",
    category: "Community",
    helpful: 123,
  },
  {
    id: "11",
    question: "How do I upgrade to Pro?",
    answer: "To upgrade to Pro, go to Settings > Trading > Subscription and click 'Upgrade to Pro'. Pro benefits include unlimited trades, real-time data, advanced charts, priority support, and exclusive features. You can pay monthly or annually (save 20%). Cancel anytime from the same page.",
    category: "Account",
    helpful: 178,
  },
  {
    id: "12",
    question: "How do I reset my portfolio?",
    answer: "To reset your portfolio and start fresh, go to Settings > Trading and scroll to 'Reset Portfolio'. This will reset your virtual balance to $100,000 and clear all positions. Note: This action cannot be undone and will affect your leaderboard ranking. Your XP and achievements will be preserved.",
    category: "Account",
    helpful: 134,
  },
]

// Guide Data
const guides: GuideItem[] = [
  {
    id: "1",
    title: "Getting Started with TradeQuest",
    description: "Learn the basics of the platform and make your first trade",
    icon: <PlayCircle className="h-5 w-5" />,
    duration: "5 min",
    type: "video",
    category: "Basics",
  },
  {
    id: "2",
    title: "Understanding the Dashboard",
    description: "Navigate the dashboard and customize your view",
    icon: <BarChart3 className="h-5 w-5" />,
    duration: "3 min",
    type: "video",
    category: "Basics",
  },
  {
    id: "3",
    title: "How to Place Your First Trade",
    description: "Step-by-step guide to buying and selling stocks",
    icon: <TrendingUp className="h-5 w-5" />,
    duration: "7 min",
    type: "video",
    category: "Trading",
  },
  {
    id: "4",
    title: "Risk Management Essentials",
    description: "Learn to protect your portfolio with stop-losses",
    icon: <Shield className="h-5 w-5" />,
    duration: "10 min read",
    type: "article",
    category: "Trading",
  },
  {
    id: "5",
    title: "XP and Leveling System Explained",
    description: "Maximize your XP earnings and level up faster",
    icon: <Zap className="h-5 w-5" />,
    duration: "4 min read",
    type: "article",
    category: "Gamification",
  },
  {
    id: "6",
    title: "Completing Daily Challenges",
    description: "How to complete challenges and earn rewards",
    icon: <Target className="h-5 w-5" />,
    duration: "5 min",
    type: "video",
    category: "Gamification",
  },
]

// Support Tickets
const supportTickets: SupportTicket[] = [
  {
    id: "TKT-1234",
    subject: "Unable to place limit order",
    status: "resolved",
    date: "Jan 25, 2026",
    lastUpdate: "Jan 26, 2026",
  },
  {
    id: "TKT-1235",
    subject: "Achievement not unlocking",
    status: "in-progress",
    date: "Jan 28, 2026",
    lastUpdate: "Jan 29, 2026",
  },
]

// Categories for FAQ
const faqCategories = [
  { id: "all", label: "All Questions", icon: <HelpCircle className="h-4 w-4" /> },
  { id: "Getting Started", label: "Getting Started", icon: <BookOpen className="h-4 w-4" /> },
  { id: "Trading", label: "Trading", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "Gamification", label: "Gamification", icon: <Trophy className="h-4 w-4" /> },
  { id: "Learning", label: "Learning", icon: <Book className="h-4 w-4" /> },
  { id: "Community", label: "Community", icon: <Users className="h-4 w-4" /> },
  { id: "Account", label: "Account", icon: <Settings className="h-4 w-4" /> },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [contactForm, setContactForm] = useState({
    subject: "",
    category: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, "up" | "down" | null>>({})

  const filteredFAQs = faqItems.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitting(false)
    setContactForm({ subject: "", category: "", message: "" })
    // Show success message
  }

  const handleHelpfulVote = (faqId: string, vote: "up" | "down") => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [faqId]: prev[faqId] === vote ? null : vote,
    }))
  }

  const getStatusColor = (status: SupportTicket["status"]) => {
    switch (status) {
      case "open":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "in-progress":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "resolved":
        return "bg-green-500/10 text-green-500 border-green-500/20"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground">
            Find answers, learn the platform, and get assistance
          </p>
        </div>
      </div>

      {/* Search Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-2xl font-semibold">How can we help you?</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                How to trade?
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                Earn XP
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                Leaderboard
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                Stop-loss
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                Upgrade Pro
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
              <Book className="h-6 w-6 text-blue-500" />
            </div>
            <p className="font-medium">Documentation</p>
            <p className="text-xs text-muted-foreground">Browse guides</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
              <Video className="h-6 w-6 text-purple-500" />
            </div>
            <p className="font-medium">Video Tutorials</p>
            <p className="text-xs text-muted-foreground">Watch & learn</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
              <MessageCircle className="h-6 w-6 text-green-500" />
            </div>
            <p className="font-medium">Live Chat</p>
            <p className="text-xs text-muted-foreground">Talk to support</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
              <Users className="h-6 w-6 text-orange-500" />
            </div>
            <p className="font-medium">Community</p>
            <p className="text-xs text-muted-foreground">Ask traders</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="faq" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="guides" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guides</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Contact</span>
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Tickets</span>
          </TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Category Sidebar */}
            <div className="lg:w-64 shrink-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {category.icon}
                      <span>{category.label}</span>
                      {category.id !== "all" && (
                        <Badge variant="secondary" className="ml-auto text-[10px]">
                          {faqItems.filter((f) => f.category === category.id).length}
                        </Badge>
                      )}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* FAQ List */}
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedCategory === "all"
                      ? "Frequently Asked Questions"
                      : selectedCategory}
                  </CardTitle>
                  <CardDescription>
                    {filteredFAQs.length} questions found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredFAQs.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFAQs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left hover:no-underline">
                            <div className="flex items-start gap-3">
                              <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span>{faq.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-8 space-y-4">
                              <p className="text-muted-foreground">{faq.answer}</p>
                              <div className="flex items-center justify-between pt-2 border-t">
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-muted-foreground">
                                    Was this helpful?
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={cn(
                                        "h-8 gap-1",
                                        helpfulVotes[faq.id] === "up" && "text-green-500"
                                      )}
                                      onClick={() => handleHelpfulVote(faq.id, "up")}
                                    >
                                      <ThumbsUp className="h-4 w-4" />
                                      <span className="text-xs">
                                        {(faq.helpful || 0) +
                                          (helpfulVotes[faq.id] === "up" ? 1 : 0)}
                                      </span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={cn(
                                        "h-8",
                                        helpfulVotes[faq.id] === "down" && "text-red-500"
                                      )}
                                      onClick={() => handleHelpfulVote(faq.id, "down")}
                                    >
                                      <ThumbsDown className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {faq.category}
                                </Badge>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium">No questions found</p>
                      <p className="text-sm text-muted-foreground">
                        Try a different search term or category
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Guides Tab */}
        <TabsContent value="guides" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Card
                key={guide.id}
                className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl shrink-0",
                        guide.type === "video"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-blue-500/10 text-blue-500"
                      )}
                    >
                      {guide.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            guide.type === "video"
                              ? "border-red-500/30 text-red-500"
                              : "border-blue-500/30 text-blue-500"
                          )}
                        >
                          {guide.type === "video" ? "Video" : "Article"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {guide.duration}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-1">{guide.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {guide.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <Badge variant="secondary" className="text-xs">
                      {guide.category}
                    </Badge>
                    <Button variant="ghost" size="sm" className="gap-1">
                      {guide.type === "video" ? "Watch" : "Read"}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Popular Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Popular Learning Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <Button variant="outline" className="justify-start gap-3 h-auto py-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div className="text-left">
                    <p className="font-medium">Technical Analysis Basics</p>
                    <p className="text-xs text-muted-foreground">
                      Learn to read charts and indicators
                    </p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start gap-3 h-auto py-3">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium">Risk Management</p>
                    <p className="text-xs text-muted-foreground">
                      Protect your portfolio from losses
                    </p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start gap-3 h-auto py-3">
                  <Wallet className="h-5 w-5 text-purple-500" />
                  <div className="text-left">
                    <p className="font-medium">Portfolio Management</p>
                    <p className="text-xs text-muted-foreground">
                      Diversification and allocation strategies
                    </p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start gap-3 h-auto py-3">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <div className="text-left">
                    <p className="font-medium">Trading Psychology</p>
                    <p className="text-xs text-muted-foreground">
                      Master your emotions while trading
                    </p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="Brief description of your issue"
                          value={contactForm.subject}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, subject: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={contactForm.category}
                          onValueChange={(value) =>
                            setContactForm({ ...contactForm, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="account">Account Issues</SelectItem>
                            <SelectItem value="trading">Trading Problems</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="billing">Billing & Payments</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="bug">Bug Report</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Describe your issue in detail..."
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, message: e.target.value })
                        }
                        className="min-h-[150px]"
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Average response time: ~4 hours
                      </p>
                      <Button type="submit" disabled={submitting} className="gap-2">
                        {submitting ? (
                          <>Sending...</>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Other Ways to Reach Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                      <MessageCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-xs text-muted-foreground">Available 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                      <Mail className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-xs text-muted-foreground">
                        support@tradequest.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                      <Headphones className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-xs text-muted-foreground">
                        +1 (800) 123-4567
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span>9:00 AM - 8:00 PM ET</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span>10:00 AM - 6:00 PM ET</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span>Closed</span>
                  </div>
                  <div className="pt-2 border-t mt-2">
                    <div className="flex items-center gap-2 text-green-500">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                      </span>
                      <span className="text-sm font-medium">Currently Online</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Support Tickets</CardTitle>
                  <CardDescription>Track the status of your support requests</CardDescription>
                </div>
                <Button className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  New Ticket
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {supportTickets.length > 0 ? (
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg",
                            ticket.status === "resolved"
                              ? "bg-green-500/10"
                              : ticket.status === "in-progress"
                              ? "bg-yellow-500/10"
                              : "bg-blue-500/10"
                          )}
                        >
                          {ticket.status === "resolved" ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : ticket.status === "in-progress" ? (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{ticket.subject}</p>
                            <Badge
                              variant="outline"
                              className={cn("text-xs", getStatusColor(ticket.status))}
                            >
                              {ticket.status === "in-progress"
                                ? "In Progress"
                                : ticket.status.charAt(0).toUpperCase() +
                                  ticket.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{ticket.id}</span>
                            <span>Created: {ticket.date}</span>
                            <span>Updated: {ticket.lastUpdate}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No support tickets</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    You haven't created any support tickets yet
                  </p>
                  <Button className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Create Your First Ticket
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ticket Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">2</p>
                    <p className="text-xs text-muted-foreground">Total Tickets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-xs text-muted-foreground">Resolved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Still Need Help */}
      <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-blue-500/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20">
                <Headphones className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Still need help?</h3>
                <p className="text-sm text-muted-foreground">
                  Our support team is ready to assist you
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Start Live Chat
              </Button>
              <Button className="gap-2">
                <Headphones className="h-4 w-4" />
                Schedule a Call
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
