"use client"

import { useState, useMemo, useEffect } from "react"
import {
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Briefcase,
  PieChart,
  Wallet,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  History
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  PieChartComponent,
} from "@/components/charts"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchPortfolio } from "@/store/slices/portfolio.slice"
import { fetchTradeHistory } from "@/store/slices/trading.slice" 
import { useMarketStream } from "@/hooks/useMarketStream"

export default function PortfolioPage() {
  const dispatch = useAppDispatch();
  
  // 1. Add Mounted State
  const [mounted, setMounted] = useState(false);

  useMarketStream();

  const { 
    holdings, 
    totalValue, 
    cashBalance, 
    loading: portfolioLoading 
  } = useAppSelector((state) => state.portfolio);

  const { 
    trades, 
    loading: historyLoading, 
    totalPages, 
    currentPage 
  } = useAppSelector((state) => state.trading);

  const [historyPage, setHistoryPage] = useState(1);

  // 2. Set Mounted to true after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchTradeHistory({ page: historyPage, limit: 5 }));
  }, [dispatch, historyPage]);

  const { totalProfitLoss, totalProfitLossPercent } = useMemo(() => {
    const cost = holdings.reduce((sum, h) => sum + (h.averagePrice * h.quantity), 0);
    const pnl = holdings.reduce((sum, h) => sum + h.profitLoss, 0);
    const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0;
    return { totalProfitLoss: pnl, totalProfitLossPercent: pnlPercent };
  }, [holdings]);

  const allocationData = useMemo(() => [
    { name: "Stocks", value: Math.max(0, totalValue - cashBalance), color: "var(--primary)" },
    { name: "Cash", value: cashBalance, color: "var(--secondary)" },
  ], [totalValue, cashBalance]);

  const handleHistoryPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setHistoryPage(newPage);
    }
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  if (portfolioLoading && holdings.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        Loading portfolio...
      </div>
    );
  }

  // Helper to safely format currency during hydration
  const formatCurrency = (val: number) => 
    mounted ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">Real-time investment tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Button size="sm">
            <Activity className="mr-2 h-4 w-4" /> Trade Now
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Value */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-primary/10 p-2">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              {/* 3. Fix Badge Hydration: Only show calculated percent when mounted */}
              <Badge variant={totalProfitLoss >= 0 ? "default" : "destructive"}>
                {mounted ? (
                  <>
                    {totalProfitLoss >= 0 ? "+" : ""}{totalProfitLossPercent.toFixed(2)}%
                  </>
                ) : (
                  "0.00%" // Server safe default
                )}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Total Portfolio Value</p>
              <p className="text-2xl font-bold">
                ${formatCurrency(totalValue)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cash Balance */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-emerald-500/10 p-2">
                <Wallet className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Cash Balance</p>
              <p className="text-2xl font-bold">
                ${formatCurrency(cashBalance)}
              </p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Available for trading</p>
          </CardContent>
        </Card>

        {/* Total P&L */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-accent/10 p-2">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Total P&L</p>
              {/* 4. Fix P&L Hydration */}
              <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? "text-accent" : "text-primary"}`}>
                {mounted ? (
                  <>
                    {totalProfitLoss >= 0 ? "+" : ""}${totalProfitLoss.toFixed(2)}
                  </>
                ) : (
                  "$0.00"
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Active Holdings Count */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-secondary/10 p-2">
                <PieChart className="h-5 w-5 text-secondary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Active Holdings</p>
              <p className="text-2xl font-bold">{mounted ? holdings.length : 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="holdings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
        </TabsList>

        {/* --- HOLDINGS TAB --- */}
        <TabsContent value="holdings" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 overflow-hidden">
              <CardHeader>
                <CardTitle>Current Holdings</CardTitle>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="overflow-x-auto">
                  <Table className="min-w-[500px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right hidden sm:table-cell">Avg Price</TableHead>
                        <TableHead className="text-right">Mkt Price</TableHead>
                        <TableHead className="text-right hidden md:table-cell">Total Value</TableHead>
                        <TableHead className="text-right">P&L</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mounted && holdings.map((holding) => (
                        <TableRow key={holding.symbol}>
                          <TableCell>
                            <div>
                              <p className="font-bold">{holding.symbol}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{holding.quantity}</TableCell>
                          <TableCell className="text-right hidden sm:table-cell">${holding.averagePrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${holding.currentPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium hidden md:table-cell">${holding.currentValue.toLocaleString()}</TableCell>
                          <TableCell className={`text-right font-bold ${holding.profitLoss >= 0 ? "text-accent" : "text-primary"}`}>
                            {holding.profitLoss >= 0 ? "+" : ""}{holding.profitLoss.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {mounted && holdings.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                            No active holdings. Start trading to build your portfolio.
                          </TableCell>
                        </TableRow>
                      )}
                      {!mounted && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          Loading holdings...
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="w-full max-w-[250px] mx-auto">
                  <PieChartComponent data={allocationData} height={180} />
                </div>
                <div className="mt-4 space-y-2">
                  {allocationData.map((item) => (
                    <div key={item.name} className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-bold">
                        ${mounted ? item.value.toLocaleString(undefined, { maximumFractionDigits: 0 }) : "0"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* --- TRADE HISTORY TAB --- */}
        <TabsContent value="history">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <Table className="min-w-[450px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead className="hidden sm:table-cell">Type</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyLoading || !mounted ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" /> Loading history...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : trades.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <History className="h-8 w-8 opacity-20" />
                            No trading history found.
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      trades.map((trade) => (
                        <TableRow key={trade._id}>
                          <TableCell>
                            <div className="flex flex-col">
                              {/* 5. Date Hydration Fix: Only render dates when mounted */}
                            <span className="font-medium text-xs sm:text-sm">{new Date(trade.executedAt).toLocaleDateString()}</span>
                              <span className="text-xs text-muted-foreground sm:flex items-center gap-1 hidden">
                                <Clock className="h-3 w-3" />
                                {new Date(trade.executedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold">{trade.symbol}</span>
                              <Badge variant={trade.type === "BUY" ? "default" : "destructive"} className="sm:hidden w-fit text-xs">
                                {trade.type}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant={trade.type === "BUY" ? "default" : "destructive"}>
                              {trade.type === "BUY" ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                              {trade.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right hidden sm:table-cell">{trade.quantity}</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm">${trade.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium text-xs sm:text-sm">
                            ${trade.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {!historyLoading && mounted && trades.length > 0 && (
                <div className="flex items-center justify-center sm:justify-end gap-2 py-4 px-4 sm:px-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleHistoryPageChange(historyPage - 1)}
                    disabled={isFirstPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  <div className="text-sm font-medium">
                    {historyPage} / {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleHistoryPageChange(historyPage + 1)}
                    disabled={isLastPage}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}