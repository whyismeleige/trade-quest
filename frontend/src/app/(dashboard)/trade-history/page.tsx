"use client"

import { useState, useEffect, useMemo } from "react"
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Filter,
  Download,
  Search,
  Calendar,
  TrendingUp,
  History,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Loader2,
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
import { Trade } from "@/types/trade.types"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchTradeHistory } from "@/store/slices/trading.slice"

// Helper to get company name (Mock map - in real app, fetch from stock details)
const getCompanyName = (symbol: string) => {
  const map: Record<string, string> = {
    AAPL: "Apple Inc.",
    TSLA: "Tesla Inc.",
    NVDA: "NVIDIA Corp.",
    GOOGL: "Alphabet Inc.",
    AMZN: "Amazon.com",
    MSFT: "Microsoft Corp.",
  };
  return map[symbol] || symbol;
};

export default function TradeHistoryPage() {
  const dispatch = useAppDispatch();
  
  // Redux State
  const { trades, loading, totalPages, currentPage: reduxPage, totalTrades } = useAppSelector(
    (state) => state.trading
  );

  // Local UI State
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [localPage, setLocalPage] = useState(1)

  // Fetch data when filters or page changes
  useEffect(() => {
    // Debounce search could be added here
    const timer = setTimeout(() => {
      dispatch(fetchTradeHistory({
        symbol: searchQuery || undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
        page: localPage,
        limit: 8 // Items per page
      }));
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, searchQuery, typeFilter, localPage]);

  // --- Statistics Calculation (Memoized) ---
  const stats = useMemo(() => {
    const buys = trades.filter(t => t.type === "BUY").length;
    const sells = trades.filter(t => t.type === "SELL").length;
    const vol = trades.reduce((acc, curr) => acc + curr.totalCost, 0);
    return { buys, sells, vol };
  }, [trades]);

  // --- Chart Data Preparation ---
  const chartData = useMemo(() => {
    // Group trades by date and sum totalCost
    const grouped = trades.reduce((acc, trade) => {
      const date = new Date(trade.executedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!acc[date]) acc[date] = 0;
      acc[date] += trade.totalCost;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .reverse(); 
  }, [trades]);

  // --- Export CSV Handler ---
  const handleExportCSV = () => {
    if (!trades || trades.length === 0) return;

    // Define CSV Headers
    const headers = ["Trade ID", "Date", "Time", "Symbol", "Company", "Type", "Quantity", "Price", "Total Cost"];
    
    // Map trades to CSV rows
    const rows = trades.map(trade => {
      const date = new Date(trade.executedAt);
      return [
        trade._id,
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        trade.symbol,
        getCompanyName(trade.symbol),
        trade.type,
        trade.quantity,
        trade.price.toFixed(2),
        trade.totalCost.toFixed(2)
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    // Create a Blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `trade_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler for pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setLocalPage(newPage);
    }
  };

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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => dispatch(fetchTradeHistory({ page: 1, limit: 8 }))}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV}
            disabled={trades.length === 0}
          >
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
                  <span className="text-sm font-medium">{stats.buys} buys</span>
                </div>
                <div className="flex items-center gap-1">
                  <ArrowDownRight className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{stats.sells} sells</span>
                </div>
              </div>
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
              <p className="text-sm font-medium text-muted-foreground">Total Volume (Page)</p>
              <p className="text-2xl font-bold">₹{stats.vol.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-accent/10 p-2">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Avg. Trade Size</p>
              <p className="text-2xl font-bold">
                ₹{trades.length > 0 ? (stats.vol / trades.length).toLocaleString('en-US', { maximumFractionDigits: 0 }) : 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Volume</CardTitle>
          <CardDescription>Value of trades executed over time</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <AreaChartComponent
              data={chartData}
              dataKey="value"
              name="Volume"
              positiveColor="var(--accent)"
              height={200}
            />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No chart data available
            </div>
          )}
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
                  placeholder="Filter symbol..."
                  className="pl-8 w-[220px]"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setLocalPage(1)
                  }}
                />
              </div>
              <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setLocalPage(1) }}>
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
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow>
                   <TableCell colSpan={7} className="h-24 text-center">
                     <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span>Loading trades...</span>
                     </div>
                   </TableCell>
                 </TableRow>
              ) : trades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <History className="h-8 w-8 mb-2 opacity-50" />
                      <p>No trades found matching your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                trades.map((trade: Trade) => (
                  <TableRow key={trade._id} className="group">
                    <TableCell>
                      <div>
                        {/* Using date-fns or native Date for formatting */}
                        <p className="font-medium">{new Date(trade.executedAt).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(trade.executedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                          <p className="text-xs text-muted-foreground max-w-[120px] truncate">
                            {getCompanyName(trade.symbol)}
                          </p>
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
                    <TableCell className="text-right font-medium">{trade.quantity}</TableCell>
                    <TableCell className="text-right">₹{trade.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{trade.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                            View Receipt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {!loading && trades.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {localPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(localPage - 1)}
                    disabled={localPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(localPage + 1)}
                    disabled={localPage === totalPages}
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