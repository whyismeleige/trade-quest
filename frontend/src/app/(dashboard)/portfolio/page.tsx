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
import { fetchTradeHistory } from "@/store/slices/trading.slice" // Import trade action

export default function PortfolioPage() {
  const dispatch = useAppDispatch();

  // --- Redux State ---
  // 1. Portfolio State
  const { 
    holdings, 
    totalValue, 
    cashBalance, 
    loading: portfolioLoading 
  } = useAppSelector((state) => state.portfolio);

  // 2. Trading History State (Renaming loading to avoid conflict)
  const { 
    trades, 
    loading: historyLoading, 
    totalPages, 
    currentPage 
  } = useAppSelector((state) => state.trading);

  // --- Local State ---
  const [historyPage, setHistoryPage] = useState(1);

  // --- Effects ---
  useEffect(() => {
    // Fetch Portfolio Data
    dispatch(fetchPortfolio());
    
    // Fetch Trade History Data (Initial load)
    dispatch(fetchTradeHistory({ page: historyPage, limit: 5 }));
  }, [dispatch, historyPage]);

  // --- Derived Metrics ---
  const { totalProfitLoss, totalProfitLossPercent } = useMemo(() => {
    const cost = holdings.reduce((sum, h) => sum + (h.averagePrice * h.quantity), 0);
    const pnl = holdings.reduce((sum, h) => sum + h.profitLoss, 0);
    const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0;
    return { totalProfitLoss: pnl, totalProfitLossPercent: pnlPercent };
  }, [holdings]);

  // Transform holdings for Allocation Chart
  const allocationData = useMemo(() => [
    { name: "Stocks", value: Math.max(0, totalValue - cashBalance), color: "var(--primary)" },
    { name: "Cash", value: cashBalance, color: "var(--secondary)" },
  ], [totalValue, cashBalance]);

  // --- Handlers ---
  const handleHistoryPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setHistoryPage(newPage);
    }
  };

  // Helper for pagination button state
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
              <Badge variant={totalProfitLoss >= 0 ? "default" : "destructive"}>
                {totalProfitLoss >= 0 ? "+" : ""}{totalProfitLossPercent.toFixed(2)}%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Total Portfolio Value</p>
              <p className="text-2xl font-bold">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
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
              <p className="text-2xl font-bold">${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
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
              <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? "text-accent" : "text-primary"}`}>
                {totalProfitLoss >= 0 ? "+" : ""}${totalProfitLoss.toFixed(2)}
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
              <p className="text-2xl font-bold">{holdings.length}</p>
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
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Current Holdings</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table className="min-w-[600px]">
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
                    {holdings.map((holding) => (
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
                    {holdings.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          No active holdings. Start trading to build your portfolio.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChartComponent data={allocationData} height={200} />
                <div className="mt-4 space-y-2">
                  {allocationData.map((item) => (
                    <div key={item.name} className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-bold">${item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* --- TRADE HISTORY TAB --- */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table className="min-w-[500px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyLoading ? (
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
                            <span className="font-medium">{new Date(trade.executedAt).toLocaleDateString()}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(trade.executedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">{trade.symbol}</TableCell>
                        <TableCell>
                          <Badge variant={trade.type === "BUY" ? "default" : "destructive"}>
                            {trade.type === "BUY" ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                            {trade.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{trade.quantity}</TableCell>
                        <TableCell className="text-right">${trade.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${trade.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Simple Pagination for History Tab */}
              {!historyLoading && trades.length > 0 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleHistoryPageChange(historyPage - 1)}
                    disabled={isFirstPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="text-sm font-medium">
                    Page {historyPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleHistoryPageChange(historyPage + 1)}
                    disabled={isLastPage}
                  >
                    Next
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