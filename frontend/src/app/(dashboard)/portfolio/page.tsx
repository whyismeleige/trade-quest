"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Filter,
  Download,
  Search,
  ChevronRight,
  ChevronDown,
  Briefcase,
  History,
  PieChart,
  BarChart3,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AreaChartComponent,
  PieChartComponent,
  BarChartComponent,
} from "@/components/charts"

// Mock data for portfolio holdings
const holdings = [
  {
    id: 1,
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    quantity: 25,
    avgCost: 165.50,
    currentPrice: 178.50,
    totalValue: 4462.50,
    totalCost: 4137.50,
    profitLoss: 325.00,
    profitLossPercent: 7.85,
    dayChange: 2.35,
    dayChangePercent: 1.33,
  },
  {
    id: 2,
    symbol: "MSFT",
    name: "Microsoft Corp.",
    sector: "Technology",
    quantity: 10,
    avgCost: 360.20,
    currentPrice: 378.90,
    totalValue: 3789.00,
    totalCost: 3602.00,
    profitLoss: 187.00,
    profitLossPercent: 5.19,
    dayChange: 4.50,
    dayChangePercent: 1.20,
  },
  {
    id: 3,
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Technology",
    quantity: 15,
    avgCost: 135.80,
    currentPrice: 140.20,
    totalValue: 2103.00,
    totalCost: 2037.00,
    profitLoss: 66.00,
    profitLossPercent: 3.24,
    dayChange: 3.10,
    dayChangePercent: 2.26,
  },
  {
    id: 4,
    symbol: "JPM",
    name: "JPMorgan Chase",
    sector: "Finance",
    quantity: 12,
    avgCost: 155.00,
    currentPrice: 162.30,
    totalValue: 1947.60,
    totalCost: 1860.00,
    profitLoss: 87.60,
    profitLossPercent: 4.71,
    dayChange: -1.20,
    dayChangePercent: -0.73,
  },
  {
    id: 5,
    symbol: "JNJ",
    name: "Johnson & Johnson",
    sector: "Healthcare",
    quantity: 8,
    avgCost: 158.50,
    currentPrice: 155.80,
    totalValue: 1246.40,
    totalCost: 1268.00,
    profitLoss: -21.60,
    profitLossPercent: -1.70,
    dayChange: -0.80,
    dayChangePercent: -0.51,
  },
  {
    id: 6,
    symbol: "XOM",
    name: "Exxon Mobil",
    sector: "Energy",
    quantity: 20,
    avgCost: 95.20,
    currentPrice: 102.50,
    totalValue: 2050.00,
    totalCost: 1904.00,
    profitLoss: 146.00,
    profitLossPercent: 7.67,
    dayChange: 1.85,
    dayChangePercent: 1.84,
  },
]

// Mock data for previous trades
const previousTrades = [
  {
    id: 1,
    date: "2026-01-30",
    time: "10:32 AM",
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "BUY",
    quantity: 10,
    price: 176.50,
    total: 1765.00,
    fees: 2.50,
    status: "Completed",
  },
  {
    id: 2,
    date: "2026-01-29",
    time: "2:15 PM",
    symbol: "TSLA",
    name: "Tesla Inc.",
    type: "SELL",
    quantity: 5,
    price: 245.80,
    total: 1229.00,
    fees: 1.75,
    status: "Completed",
    profitLoss: 125.00,
  },
  {
    id: 3,
    date: "2026-01-29",
    time: "11:45 AM",
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    type: "BUY",
    quantity: 3,
    price: 875.20,
    total: 2625.60,
    fees: 3.50,
    status: "Completed",
  },
  {
    id: 4,
    date: "2026-01-28",
    time: "9:30 AM",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    type: "BUY",
    quantity: 8,
    price: 138.50,
    total: 1108.00,
    fees: 1.50,
    status: "Completed",
  },
  {
    id: 5,
    date: "2026-01-27",
    time: "3:45 PM",
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    type: "SELL",
    quantity: 10,
    price: 182.30,
    total: 1823.00,
    fees: 2.50,
    status: "Completed",
    profitLoss: -45.00,
  },
  {
    id: 6,
    date: "2026-01-27",
    time: "10:20 AM",
    symbol: "META",
    name: "Meta Platforms",
    type: "BUY",
    quantity: 4,
    price: 495.50,
    total: 1982.00,
    fees: 2.75,
    status: "Completed",
  },
  {
    id: 7,
    date: "2026-01-26",
    time: "1:30 PM",
    symbol: "JPM",
    name: "JPMorgan Chase",
    type: "SELL",
    quantity: 15,
    price: 160.80,
    total: 2412.00,
    fees: 3.25,
    status: "Completed",
    profitLoss: 180.00,
  },
  {
    id: 8,
    date: "2026-01-25",
    time: "11:00 AM",
    symbol: "MSFT",
    name: "Microsoft Corp.",
    type: "BUY",
    quantity: 5,
    price: 372.40,
    total: 1862.00,
    fees: 2.50,
    status: "Completed",
  },
  {
    id: 9,
    date: "2026-01-24",
    time: "2:45 PM",
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "SELL",
    quantity: 8,
    price: 174.20,
    total: 1393.60,
    fees: 2.00,
    status: "Completed",
    profitLoss: 88.00,
  },
  {
    id: 10,
    date: "2026-01-23",
    time: "9:45 AM",
    symbol: "XOM",
    name: "Exxon Mobil",
    type: "BUY",
    quantity: 20,
    price: 95.20,
    total: 1904.00,
    fees: 2.50,
    status: "Completed",
  },
]

// Portfolio history data
const portfolioHistory = [
  { name: "Jan 1", value: 10000 },
  { name: "Jan 5", value: 10450 },
  { name: "Jan 10", value: 10200 },
  { name: "Jan 15", value: 11200 },
  { name: "Jan 20", value: 11800 },
  { name: "Jan 25", value: 11500 },
  { name: "Jan 30", value: 15598.50 },
]

// Sector allocation data
const sectorAllocation = [
  { name: "Technology", value: 10354.50, color: "var(--primary)" },
  { name: "Finance", value: 1947.60, color: "var(--secondary)" },
  { name: "Healthcare", value: 1246.40, color: "var(--accent)" },
  { name: "Energy", value: 2050.00, color: "var(--chart-4)" },
]

// Monthly performance data
const monthlyPerformance = [
  { name: "Aug", value: 330 },
  { name: "Sep", value: 450 },
  { name: "Oct", value: 340 },
  { name: "Nov", value: 740 },
  { name: "Dec", value: 440 },
  { name: "Jan", value: 610 },
]

export default function PortfolioPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("1M")
  const [tradeFilter, setTradeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Calculate totals
  const totalValue = holdings.reduce((sum, h) => sum + h.totalValue, 0)
  const totalCost = holdings.reduce((sum, h) => sum + h.totalCost, 0)
  const totalProfitLoss = totalValue - totalCost
  const totalProfitLossPercent = ((totalProfitLoss / totalCost) * 100)
  const todayChange = holdings.reduce((sum, h) => sum + (h.dayChange * h.quantity), 0)
  const todayChangePercent = (todayChange / (totalValue - todayChange)) * 100

  // Filter trades based on search and filter
  const filteredTrades = previousTrades.filter((trade) => {
    const matchesSearch = 
      trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = 
      tradeFilter === "all" || 
      trade.type.toLowerCase() === tradeFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">
            Track your investments and trading history
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Activity className="mr-2 h-4 w-4" />
            Trade Now
          </Button>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-primary/10 p-2">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <Badge variant={totalProfitLoss >= 0 ? "default" : "destructive"}>
                {totalProfitLoss >= 0 ? "+" : ""}{totalProfitLossPercent.toFixed(2)}%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm">
              {totalProfitLoss >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-accent" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-primary" />
              )}
              <span className={totalProfitLoss >= 0 ? "text-accent" : "text-primary"}>
                ${Math.abs(totalProfitLoss).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-muted-foreground">all time</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-accent/10 p-2">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <Badge variant={todayChange >= 0 ? "default" : "destructive"}>
                {todayChange >= 0 ? "+" : ""}{todayChangePercent.toFixed(2)}%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Today&apos;s Change</p>
              <p className="text-2xl font-bold">
                <span className={todayChange >= 0 ? "text-accent" : "text-primary"}>
                  {todayChange >= 0 ? "+" : ""}${todayChange.toFixed(2)}
                </span>
              </p>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Updated just now</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-secondary/10 p-2">
                <PieChart className="h-5 w-5 text-secondary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Holdings</p>
              <p className="text-2xl font-bold">{holdings.length}</p>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <span>Across {sectorAllocation.length} sectors</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-chart-4/10 p-2">
                <History className="h-5 w-5 text-chart-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
              <p className="text-2xl font-bold">{previousTrades.length}</p>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>This month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="holdings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="holdings">
            <Briefcase className="mr-2 h-4 w-4" />
            Holdings
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            Trade History
          </TabsTrigger>
          <TabsTrigger value="performance">
            <BarChart3 className="mr-2 h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Holdings Tab */}
        <TabsContent value="holdings" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Holdings Table */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Current Holdings</CardTitle>
                <CardDescription>Your active stock positions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Avg Cost</TableHead>
                      <TableHead className="text-right">Current</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-right">P&L</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holdings.map((holding) => (
                      <TableRow key={holding.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-bold text-sm">
                              {holding.symbol.slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-semibold">{holding.symbol}</p>
                              <p className="text-xs text-muted-foreground">{holding.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">{holding.quantity}</TableCell>
                        <TableCell className="text-right">${holding.avgCost.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p className="font-medium">${holding.currentPrice.toFixed(2)}</p>
                            <p className={`text-xs ${holding.dayChangePercent >= 0 ? "text-accent" : "text-primary"}`}>
                              {holding.dayChangePercent >= 0 ? "+" : ""}{holding.dayChangePercent.toFixed(2)}%
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${holding.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className={holding.profitLoss >= 0 ? "text-accent" : "text-primary"}>
                            <p className="font-semibold">
                              {holding.profitLoss >= 0 ? "+" : ""}${holding.profitLoss.toFixed(2)}
                            </p>
                            <p className="text-xs">
                              {holding.profitLossPercent >= 0 ? "+" : ""}{holding.profitLossPercent.toFixed(2)}%
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Sector Allocation */}
            <Card>
              <CardHeader>
                <CardTitle>Sector Allocation</CardTitle>
                <CardDescription>Portfolio distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChartComponent
                  data={sectorAllocation}
                  type="donut"
                  height={200}
                  showLabels={false}
                  showLegend={false}
                />
                <Separator className="my-4" />
                <div className="space-y-3">
                  {sectorAllocation.map((item) => {
                    const percentage = (item.value / totalValue) * 100
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={percentage} className="h-1.5" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trade History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Trade History</CardTitle>
                  <CardDescription>Your previous trading activity</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search trades..."
                      className="pl-8 w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={tradeFilter} onValueChange={setTradeFilter}>
                    <SelectTrigger className="w-[120px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Trades</SelectItem>
                      <SelectItem value="buy">Buy Only</SelectItem>
                      <SelectItem value="sell">Sell Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">P&L</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{trade.date}</p>
                          <p className="text-xs text-muted-foreground">{trade.time}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted font-bold text-xs">
                            {trade.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold">{trade.symbol}</p>
                            <p className="text-xs text-muted-foreground">{trade.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={trade.type === "BUY" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {trade.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{trade.quantity}</TableCell>
                      <TableCell className="text-right">${trade.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${trade.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        {trade.profitLoss !== undefined ? (
                          <span className={trade.profitLoss >= 0 ? "text-accent font-medium" : "text-primary font-medium"}>
                            {trade.profitLoss >= 0 ? "+" : ""}${trade.profitLoss.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="text-xs">
                          {trade.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredTrades.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <History className="h-12 w-12 mb-4 opacity-50" />
                  <p>No trades found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Portfolio Value Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Portfolio Value</CardTitle>
                  <CardDescription>Your portfolio growth over time</CardDescription>
                </div>
                <div className="flex gap-1">
                  {["1W", "1M", "3M", "6M", "1Y", "ALL"].map((period) => (
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

            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Stats</CardTitle>
                <CardDescription>Key metrics overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Return</span>
                    <span className={`font-bold ${totalProfitLoss >= 0 ? "text-accent" : "text-primary"}`}>
                      {totalProfitLoss >= 0 ? "+" : ""}{totalProfitLossPercent.toFixed(2)}%
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Best Performer</span>
                    <div className="text-right">
                      <p className="font-semibold">AAPL</p>
                      <p className="text-xs text-accent">+7.85%</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Worst Performer</span>
                    <div className="text-right">
                      <p className="font-semibold">JNJ</p>
                      <p className="text-xs text-primary">-1.70%</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Win Rate</span>
                    <span className="font-bold text-accent">83.3%</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Holding Period</span>
                    <span className="font-bold">12 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly P&L Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Net Profit</CardTitle>
              <CardDescription>Net trading performance by month</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartComponent
                data={monthlyPerformance}
                dataKey="value"
                name="Net Profit"
                fill="var(--accent)"
                height={250}
                showColors={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
