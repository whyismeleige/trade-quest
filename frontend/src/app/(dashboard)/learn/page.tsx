"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  TrendingUp,
  Shield,
  Brain,
  BarChart3,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  LineChart,
  PieChart,
  Trophy,
  Zap,
} from "lucide-react"

const tableOfContents = [
  { id: "getting-started", title: "Getting Started", icon: <BookOpen className="h-4 w-4" /> },
  { id: "trading-basics", title: "Trading Basics", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "understanding-markets", title: "Understanding Markets", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "order-types", title: "Order Types", icon: <Target className="h-4 w-4" /> },
  { id: "portfolio-management", title: "Portfolio Management", icon: <PieChart className="h-4 w-4" /> },
  { id: "risk-management", title: "Risk Management", icon: <Shield className="h-4 w-4" /> },
  { id: "technical-analysis", title: "Technical Analysis", icon: <LineChart className="h-4 w-4" /> },
  { id: "gamification", title: "Gamification & XP", icon: <Trophy className="h-4 w-4" /> },
]

const quickTips = [
  { tip: "Never risk more than 2% of your portfolio per trade", category: "Risk" },
  { tip: "Always set a stop-loss before entering a position", category: "Risk" },
  { tip: "The trend is your friend - don't fight it", category: "Technical" },
  { tip: "Don't chase trades, wait for proper setups", category: "Psychology" },
  { tip: "Keep a trading journal to track your decisions", category: "Discipline" },
  { tip: "Diversify your portfolio across different sectors", category: "Portfolio" },
]

const glossary = [
  { term: "Bull Market", definition: "A market condition where prices are rising or expected to rise" },
  { term: "Bear Market", definition: "A market condition where prices are falling or expected to fall" },
  { term: "Bid", definition: "The highest price a buyer is willing to pay for a stock" },
  { term: "Ask", definition: "The lowest price a seller is willing to accept for a stock" },
  { term: "Spread", definition: "The difference between the bid and ask price" },
  { term: "Volume", definition: "The number of shares traded during a given period" },
  { term: "Market Cap", definition: "Total market value of a company's outstanding shares" },
  { term: "P/E Ratio", definition: "Price-to-Earnings ratio, used to value a company" },
]

export default function LearnPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <aside className="lg:w-64 lg:shrink-0">
        <div className="lg:sticky lg:top-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Documentation
              </CardTitle>
              <CardDescription>Trading Guide & Manual</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-auto lg:h-[calc(100vh-200px)]">
                <nav className="space-y-1 p-4 pt-0">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </button>
                  ))}
                </nav>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </aside>

      <main className="flex-1 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learn to Trade</h1>
          <p className="text-muted-foreground mt-2">
            Your comprehensive guide to mastering the TradeQuest platform and trading fundamentals
          </p>
        </div>

        <section id="getting-started" className="scroll-mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>Welcome to TradeQuest</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                TradeQuest is a gamified paper trading platform designed to help you learn trading without risking real money. 
                Every new account starts with <strong>$100,000 in virtual currency</strong> to practice with.
              </p>
              
              <h4 className="flex items-center gap-2 mt-6 mb-3">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                What you can do on TradeQuest:
              </h4>
              <ul className="space-y-2">
                <li>Buy and sell stocks with real-time simulated prices</li>
                <li>Track your portfolio performance and history</li>
                <li>Compete on leaderboards with other traders</li>
                <li>Earn XP and achievements as you learn</li>
                <li>Practice different trading strategies risk-free</li>
              </ul>

              <div className="flex items-start gap-3 mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-blue-600 dark:text-blue-400 m-0">Pro Tip</p>
                  <p className="text-sm text-muted-foreground m-0 mt-1">
                    Start with the Dashboard to get an overview of your account, then explore the Stocks page to make your first trade.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="trading-basics" className="scroll-mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <CardTitle>Trading Basics</CardTitle>
                  <CardDescription>Fundamental concepts every trader should know</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <h4>What is Stock Trading?</h4>
              <p>
                Stock trading involves buying and selling shares of publicly traded companies. When you buy a stock, 
                you&apos;re purchasing a small ownership stake in that company. The goal is to buy stocks at a lower price 
                and sell them at a higher price for a profit.
              </p>

              <h4 className="mt-6">Key Concepts</h4>
              
              <div className="grid gap-4 md:grid-cols-2 not-prose mt-4">
                <div className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-semibold">Going Long</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Buying a stock expecting its price to increase. You profit when you sell at a higher price than you bought.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold">Price Movement</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Stock prices fluctuate based on supply, demand, company performance, market conditions, and news.
                  </p>
                </div>
              </div>

              <h4 className="mt-6">The Trading Process</h4>
              <ol className="space-y-2">
                <li><strong>Research:</strong> Analyze stocks using charts, news, and company fundamentals</li>
                <li><strong>Plan:</strong> Decide your entry price, target profit, and stop-loss level</li>
                <li><strong>Execute:</strong> Place your buy order through the trading interface</li>
                <li><strong>Monitor:</strong> Track your position in your portfolio</li>
                <li><strong>Exit:</strong> Sell when you reach your target or stop-loss</li>
              </ol>
            </CardContent>
          </Card>
        </section>

        <section id="understanding-markets" className="scroll-mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Understanding Markets</CardTitle>
                  <CardDescription>How stock markets work</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <h4>Market Hours</h4>
              <p>The US stock market (NYSE, NASDAQ) is typically open Monday through Friday:</p>
              <ul>
                <li><strong>Pre-market:</strong> 4:00 AM - 9:30 AM ET</li>
                <li><strong>Regular trading:</strong> 9:30 AM - 4:00 PM ET</li>
                <li><strong>After-hours:</strong> 4:00 PM - 8:00 PM ET</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Note: TradeQuest simulates 24/7 trading for practice purposes.
              </p>

              <h4 className="mt-6">Market Indices</h4>
              <p>Indices track the performance of a group of stocks to represent the overall market:</p>
              <div className="grid gap-3 not-prose mt-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="font-medium">S&P 500</span>
                  <span className="text-sm text-muted-foreground">Top 500 US companies</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="font-medium">NASDAQ</span>
                  <span className="text-sm text-muted-foreground">Tech-heavy index</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="font-medium">Dow Jones</span>
                  <span className="text-sm text-muted-foreground">30 large US companies</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="order-types" className="scroll-mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <Target className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle>Order Types</CardTitle>
                  <CardDescription>Different ways to execute trades</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <div className="grid gap-4 not-prose">
                <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>Most Common</Badge>
                    <span className="font-semibold">Market Order</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Executes immediately at the current market price. Best for when you want to enter or exit a position quickly.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <span className="font-semibold">Limit Order</span>
                  <p className="text-sm text-muted-foreground mt-2">
                    Sets a specific price at which you want to buy or sell. The order only executes if the market reaches your price.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <span className="font-semibold">Stop-Loss Order</span>
                  <p className="text-sm text-muted-foreground mt-2">
                    Automatically sells your position if the price drops to a certain level. Essential for risk management.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <span className="font-semibold">Take-Profit Order</span>
                  <p className="text-sm text-muted-foreground mt-2">
                    Automatically sells your position when a target profit is reached. Helps lock in gains.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="portfolio-management" className="scroll-mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <PieChart className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle>Portfolio Management</CardTitle>
                  <CardDescription>Building and maintaining your portfolio</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <h4>Diversification</h4>
              <p>Don&apos;t put all your eggs in one basket. Spread your investments across different:</p>
              <ul>
                <li><strong>Sectors:</strong> Technology, Healthcare, Finance, Energy, etc.</li>
                <li><strong>Company sizes:</strong> Large-cap, mid-cap, small-cap stocks</li>
                <li><strong>Risk levels:</strong> Mix stable blue-chips with growth stocks</li>
              </ul>

              <div className="flex items-start gap-3 mt-4 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20 not-prose">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-amber-600 dark:text-amber-400">Rule of Thumb</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Never risk more than 1-2% of your total portfolio on a single trade.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="risk-management" className="scroll-mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                  <Shield className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <CardTitle>Risk Management</CardTitle>
                  <CardDescription>Protecting your capital is priority #1</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-lg border border-red-500/20 not-prose mb-6">
                <Shield className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">Golden Rule</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Protect your capital first, profits second. You can&apos;t trade if you&apos;ve lost all your money.
                  </p>
                </div>
              </div>

              <h4>Key Risk Management Strategies</h4>
              <div className="grid gap-4 not-prose mt-4">
                <div className="p-4 rounded-lg border bg-muted/30">
                  <span className="font-semibold">1. Always Use Stop-Losses</span>
                  <p className="text-sm text-muted-foreground mt-2">
                    Set a stop-loss on every trade to automatically exit if the price moves against you.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <span className="font-semibold">2. Risk-Reward Ratio</span>
                  <p className="text-sm text-muted-foreground mt-2">
                    Only take trades where the potential reward is at least 2x the potential risk.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <span className="font-semibold">3. Avoid Overtrading</span>
                  <p className="text-sm text-muted-foreground mt-2">
                    Quality over quantity. Wait for high-probability setups rather than forcing trades.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <span className="font-semibold">4. Control Emotions</span>
                  <p className="text-sm text-muted-foreground mt-2">
                    Fear and greed are a trader&apos;s worst enemies. Stick to your trading plan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="technical-analysis" className="scroll-mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                  <LineChart className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <CardTitle>Technical Analysis</CardTitle>
                  <CardDescription>Reading charts and identifying patterns</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <h4>Chart Types</h4>
              <ul>
                <li><strong>Candlestick charts:</strong> Show open, high, low, and close prices (most popular)</li>
                <li><strong>Line charts:</strong> Simple view of closing prices over time</li>
                <li><strong>Area charts:</strong> Like line charts but filled below the line</li>
              </ul>

              <h4 className="mt-6">Key Indicators</h4>
              <div className="grid gap-3 not-prose mt-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-3 rounded-lg border">
                  <div className="font-semibold sm:min-w-[120px]">Moving Averages</div>
                  <p className="text-sm text-muted-foreground">Smooth out price data to identify trends.</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-3 rounded-lg border">
                  <div className="font-semibold sm:min-w-[120px]">RSI</div>
                  <p className="text-sm text-muted-foreground">Measures if a stock is overbought or oversold.</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-3 rounded-lg border">
                  <div className="font-semibold sm:min-w-[120px]">Volume</div>
                  <p className="text-sm text-muted-foreground">High volume confirms price movements.</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-3 rounded-lg border">
                  <div className="font-semibold sm:min-w-[120px]">Support/Resistance</div>
                  <p className="text-sm text-muted-foreground">Key price levels where pressure is strong.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="gamification" className="scroll-mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <CardTitle>Gamification & XP</CardTitle>
                  <CardDescription>Level up while you learn</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                TradeQuest makes learning fun with a comprehensive gamification system. 
                Earn XP, unlock achievements, and compete with other traders!
              </p>

              <h4 className="mt-6">Earning XP</h4>
              <div className="grid gap-3 not-prose mt-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Complete a trade</span>
                  </div>
                  <Badge variant="secondary">+25 XP</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Profitable trade</span>
                  </div>
                  <Badge variant="secondary">+50 XP</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Daily login streak</span>
                  </div>
                  <Badge variant="secondary">+10 XP/day</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Achievement unlocked</span>
                  </div>
                  <Badge variant="secondary">+100-500 XP</Badge>
                </div>
              </div>

              <h4 className="mt-6">Leaderboards</h4>
              <ul>
                <li><strong>Portfolio Value:</strong> Highest total portfolio worth</li>
                <li><strong>Daily Gains:</strong> Best single-day performance</li>
                <li><strong>XP Leaders:</strong> Most experience points earned</li>
                <li><strong>Win Rate:</strong> Highest percentage of profitable trades</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickTips.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.tip}</p>
                    <Badge variant="secondary" className="text-xs mt-1">{item.category}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Key Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {glossary.map((item, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50">
                  <p className="font-semibold text-sm">{item.term}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.definition}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 shrink-0">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Practice Makes Perfect</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  The best way to learn trading is by doing it. Use your virtual $100,000 to experiment 
                  with different strategies, make mistakes, and learn from them - all without risking real money.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
