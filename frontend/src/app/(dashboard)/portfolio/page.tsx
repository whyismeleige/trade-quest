"use client"

import { useState, useMemo } from "react"
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
  Briefcase,
  History,
  PieChart,
  BarChart3,
  Calendar,
  Wallet,
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
import { useAppSelector } from "@/store/hooks"

export default function PortfolioPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("1M")
  const [tradeFilter, setTradeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // --- Real Data Integration ---
  const { holdings, totalValue, cashBalance, loading } = useAppSelector((state) => state.portfolio);

  // Calculate derived P&L metrics from real data
  const { totalProfitLoss, totalProfitLossPercent, totalCost } = useMemo(() => {
    const cost = holdings.reduce((sum, h) => sum + (h.averagePrice * h.quantity), 0);
    const pnl = holdings.reduce((sum, h) => sum + h.profitLoss, 0);
    const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0;
    return { totalProfitLoss: pnl, totalProfitLossPercent: pnlPercent, totalCost: cost };
  }, [holdings]);

  // Transform holdings for the Sector Allocation (Mocking sector as 'Equity' since API doesn't provide it)
  const allocationData = useMemo(() => [
    { name: "Stocks", value: totalValue - cashBalance, color: "var(--primary)" },
    { name: "Cash", value: cashBalance, color: "var(--secondary)" },
  ], [totalValue, cashBalance]);

  if (loading) {
    return <div className="flex h-96 items-center justify-center">Loading portfolio...</div>;
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
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button size="sm">
            <Activity className="mr-2 h-4 w-4" /> Trade Now
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
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
              <p className="text-sm font-medium text-muted-foreground">Total Portfolio Value</p>
              <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-emerald-500/10 p-2">
                <Wallet className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Cash Balance</p>
              <p className="text-2xl font-bold">${cashBalance.toLocaleString()}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Available for trading</p>
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
              <p className="text-sm font-medium text-muted-foreground">Total P&L</p>
              <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? "text-accent" : "text-primary"}`}>
                {totalProfitLoss >= 0 ? "+" : ""}${totalProfitLoss.toFixed(2)}
              </p>
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
              <p className="text-sm font-medium text-muted-foreground">Active Holdings</p>
              <p className="text-2xl font-bold">{holdings.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="holdings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Current Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Avg Price</TableHead>
                      <TableHead className="text-right">Market Price</TableHead>
                      <TableHead className="text-right">Total Value</TableHead>
                      <TableHead className="text-right">P&L</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holdings.map((holding) => (
                      <TableRow key={holding.symbol}>
                        <TableCell className="font-bold">{holding.symbol}</TableCell>
                        <TableCell className="text-right">{holding.quantity}</TableCell>
                        <TableCell className="text-right">${holding.averagePrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${holding.currentPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">${holding.currentValue.toLocaleString()}</TableCell>
                        <TableCell className={`text-right font-bold ${holding.profitLoss >= 0 ? "text-accent" : "text-primary"}`}>
                          {holding.profitLoss >= 0 ? "+" : ""}{holding.profitLoss.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {holdings.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No holdings found.</TableCell>
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
                      <span>{item.name}</span>
                      <span className="font-bold">${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Note: Trade History would need its own state/API call if not in PortfolioData */}
        <TabsContent value="history">
          <Card>
            <CardHeader><CardTitle>Trade History</CardTitle></CardHeader>
            <CardContent className="text-center py-10 text-muted-foreground">
              History data integration pending API endpoint.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}