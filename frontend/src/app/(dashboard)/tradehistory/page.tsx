"use client"

import { useState } from "react"
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Filter,
  Download,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  History,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AreaChartComponent } from "@/components/charts"

// Mock data for trade history
const tradeHistory = [
  {
    id: "TRD-001",
    date: "2026-01-30",
    time: "10:32:15 AM",
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "BUY",
    orderType: "Market",
    quantity: 10,
    price: 176.50,
    total: 1765.00,
    fees: 2.50,
    status: "Completed",
    executionTime: "0.3s",
  },
  {
    id: "TRD-002",
    date: "2026-01-29",
    time: "2:15:42 PM",
    symbol: "TSLA",
    name: "Tesla Inc.",
    type: "SELL",
    orderType: "Limit",
    quantity: 5,
    price: 245.80,
    total: 1229.00,
    fees: 1.75,
    status: "Completed",
    profitLoss: 125.00,
    profitLossPercent: 11.32,
    executionTime: "0.5s",
  },
  {
    id: "TRD-003",
    date: "2026-01-29",
    time: "11:45:20 AM",
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    type: "BUY",
    orderType: "Market",
    quantity: 3,
    price: 875.20,
    total: 2625.60,
    fees: 3.50,
    status: "Completed",
    executionTime: "0.2s",
  },
  {
    id: "TRD-004",
    date: "2026-01-28",
    time: "9:30:05 AM",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    type: "BUY",
    orderType: "Limit",
    quantity: 8,
    price: 138.50,
    total: 1108.00,
    fees: 1.50,
    status: "Completed",
    executionTime: "1.2s",
  },
  {
    id: "TRD-005",
    date: "2026-01-27",
    time: "3:45:33 PM",
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    type: "SELL",
    orderType: "Market",
    quantity: 10,
    price: 182.30,
    total: 1823.00,
    fees: 2.50,
    status: "Completed",
    profitLoss: -45.00,
    profitLossPercent: -2.41,
    executionTime: "0.3s",
  },
  {
    id: "TRD-006",
    date: "2026-01-27",
    time: "10:20:18 AM",
    symbol: "META",
    name: "Meta Platforms",
    type: "BUY",
    orderType: "Market",
    quantity: 4,
    price: 495.50,
    total: 1982.00,
    fees: 2.75,
    status: "Completed",
    executionTime: "0.4s",
  },
  {
    id: "TRD-007",
    date: "2026-01-26",
    time: "1:30:45 PM",
    symbol: "JPM",
    name: "JPMorgan Chase",
    type: "SELL",
    orderType: "Limit",
    quantity: 15,
    price: 160.80,
    total: 2412.00,
    fees: 3.25,
    status: "Completed",
    profitLoss: 180.00,
    profitLossPercent: 8.06,
    executionTime: "0.8s",
  },
  {
    id: "TRD-008",
    date: "2026-01-25",
    time: "11:00:22 AM",
    symbol: "MSFT",
    name: "Microsoft Corp.",
    type: "BUY",
    orderType: "Market",
    quantity: 5,
    price: 372.40,
    total: 1862.00,
    fees: 2.50,
    status: "Completed",
    executionTime: "0.3s",
  },
  {
    id: "TRD-009",
    date: "2026-01-24",
    time: "2:45:10 PM",
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "SELL",
    orderType: "Stop Loss",
    quantity: 8,
    price: 174.20,
    total: 1393.60,
    fees: 2.00,
    status: "Completed",
    profitLoss: 88.00,
    profitLossPercent: 6.74,
    executionTime: "0.2s",
  },
  {
    id: "TRD-010",
    date: "2026-01-23",
    time: "9:45:55 AM",
    symbol: "XOM",
    name: "Exxon Mobil",
    type: "BUY",
    orderType: "Market",
    quantity: 20,
    price: 95.20,
    total: 1904.00,
    fees: 2.50,
    status: "Completed",
    executionTime: "0.3s",
  },
  {
    id: "TRD-011",
    date: "2026-01-22",
    time: "12:15:30 PM",
    symbol: "DIS",
    name: "Walt Disney Co.",
    type: "BUY",
    orderType: "Limit",
    quantity: 12,
    price: 112.50,
    total: 1350.00,
    fees: 1.80,
    status: "Completed",
    executionTime: "2.1s",
  },
  {
    id: "TRD-012",
    date: "2026-01-21",
    time: "10:05:12 AM",
    symbol: "BA",
    name: "Boeing Co.",
    type: "SELL",
    orderType: "Market",
    quantity: 6,
    price: 215.30,
    total: 1291.80,
    fees: 1.75,
    status: "Completed",
    profitLoss: -62.00,
    profitLossPercent: -4.58,
    executionTime: "0.4s",
  },
]

// Daily trading volume data
const tradingVolumeData = [
  { name: "Jan 21", value: 1291.80 },
  { name: "Jan 22", value: 1350.00 },
  { name: "Jan 23", value: 1904.00 },
  { name: "Jan 24", value: 1393.60 },
  { name: "Jan 25", value: 1862.00 },
  { name: "Jan 26", value: 2412.00 },
  { name: "Jan 27", value: 3805.00 },
  { name: "Jan 28", value: 1108.00 },
  { name: "Jan 29", value: 3854.60 },
  { name: "Jan 30", value: 1765.00 },
]

export default function TradeHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [orderTypeFilter, setOrderTypeFilter] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Calculate statistics
  const totalTrades = tradeHistory.length
  const buyTrades = tradeHistory.filter(t => t.type === "BUY").length
  const sellTrades = tradeHistory.filter(t => t.type === "SELL").length
  const totalVolume = tradeHistory.reduce((sum, t) => sum + t.total, 0)
  const totalFees = tradeHistory.reduce((sum, t) => sum + t.fees, 0)
  const realizedPL = tradeHistory
    .filter(t => t.profitLoss !== undefined)
    .reduce((sum, t) => sum + (t.profitLoss || 0), 0)
  const winningTrades = tradeHistory.filter(t => t.profitLoss && t.profitLoss > 0).length
  const losingTrades = tradeHistory.filter(t => t.profitLoss && t.profitLoss < 0).length
  const winRate = sellTrades > 0 ? (winningTrades / sellTrades) * 100 : 0

  // Filter trades
  const filteredTrades = tradeHistory.filter((trade) => {
    const matchesSearch =
      trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || trade.type.toLowerCase() === typeFilter
    const matchesOrderType = orderTypeFilter === "all" || trade.orderType.toLowerCase().replace(" ", "") === orderTypeFilter
    return matchesSearch && matchesType && matchesOrderType
  })

  // Pagination
  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage)
  const paginatedTrades = filteredTrades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trade History</h1>
          <p className="text-muted-foreground">
            View and analyze your complete trading history
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-primary/10 p-2">
                <History className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary">{totalTrades} total</Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Total Trades</p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">{buyTrades} buys</span>
                </div>
                <div className="flex items-center gap-1">
                  <ArrowDownRight className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{sellTrades} sells</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-accent/10 p-2">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <Badge variant={realizedPL >= 0 ? "default" : "destructive"}>
                {realizedPL >= 0 ? "Profit" : "Loss"}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Realized P&L</p>
              <p className={`text-2xl font-bold ${realizedPL >= 0 ? "text-accent" : "text-primary"}`}>
                {realizedPL >= 0 ? "+" : ""}${realizedPL.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-secondary/10 p-2">
                <Calendar className="h-5 w-5 text-secondary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold">${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Fees: ${totalFees.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-chart-4/10 p-2">
                <TrendingUp className="h-5 w-5 text-chart-4" />
              </div>
              <Badge variant="secondary">{winRate.toFixed(0)}%</Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-accent">{winningTrades} wins</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-primary">{losingTrades} losses</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Trading Volume</CardTitle>
          <CardDescription>Your trading activity over the past 10 days</CardDescription>
        </CardHeader>
        <CardContent>
          <AreaChartComponent
            data={tradingVolumeData}
            dataKey="value"
            name="Volume"
            positiveColor="var(--accent)"
            height={200}
          />
        </CardContent>
      </Card>

      {/* Trade History Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Trades</CardTitle>
              <CardDescription>Complete list of your executed trades</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by symbol, name or ID..."
                  className="pl-8 w-[220px]"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
              <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[110px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
              <Select value={orderTypeFilter} onValueChange={(v) => { setOrderTypeFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Order Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="limit">Limit</SelectItem>
                  <SelectItem value="stoploss">Stop Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trade ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">P&L</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTrades.map((trade) => (
                <TableRow key={trade.id} className="group">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {trade.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{trade.date}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {trade.time}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted font-bold text-xs">
                        {trade.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold">{trade.symbol}</p>
                        <p className="text-xs text-muted-foreground max-w-[120px] truncate">{trade.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={trade.type === "BUY" ? "default" : "destructive"}
                      className="text-xs font-medium"
                    >
                      {trade.type === "BUY" ? (
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-3 w-3" />
                      )}
                      {trade.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {trade.orderType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{trade.quantity}</TableCell>
                  <TableCell className="text-right">${trade.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${trade.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    {trade.profitLoss !== undefined ? (
                      <div className={trade.profitLoss >= 0 ? "text-accent" : "text-primary"}>
                        <p className="font-semibold">
                          {trade.profitLoss >= 0 ? "+" : ""}${trade.profitLoss.toFixed(2)}
                        </p>
                        <p className="text-xs">
                          {trade.profitLossPercent && trade.profitLossPercent >= 0 ? "+" : ""}
                          {trade.profitLossPercent?.toFixed(2)}%
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {trade.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download Receipt
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Empty State */}
          {filteredTrades.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mb-4 opacity-50" />
              <p className="font-medium">No trades found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Pagination */}
          {filteredTrades.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTrades.length)} of {filteredTrades.length} trades
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
