"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  TrendingUp, 
  TrendingDown, 
  ChevronDown, 
  Loader2, 
  AlertCircle, 
  Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

// Make sure this points to your corrected Chart Component file
import { AreaChartComponent } from "@/components/charts/area-chart"; 

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchStockDetails,
  fetchStockHistory,
} from "@/store/slices/stocks.slice";

export default function StockPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // 1. Handle Route Params (supports [id] or [stockid])
  const rawId = params.stockid || params.id;
  const stockSymbol = typeof rawId === 'string' ? rawId.toUpperCase() : "AAPL";

  const { selectedStock, stockHistory, loading } = useAppSelector(
    (state) => state.stocks,
  );

  const [selectedInterval, setSelectedInterval] = useState("1D"); // Default to 1D
  const [tradeQty, setTradeQty] = useState("1");

  // 2. Initial Data Load
  useEffect(() => {
    if (!stockSymbol) return;

    const loadData = async () => {
      // Fetch details (current price, name, etc.)
      const result = await dispatch(fetchStockDetails(stockSymbol));
      
      if (fetchStockDetails.rejected.match(result)) {
        router.push("/?error=stock_not_found");
      } else {
        // If details found, fetch the history for the default interval
        dispatch(fetchStockHistory({ symbol: stockSymbol, range: selectedInterval }));
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockSymbol, router, dispatch]);

  // 3. Interval Switcher Listener
  useEffect(() => {
    if (stockSymbol) {
      dispatch(fetchStockHistory({ symbol: stockSymbol, range: selectedInterval }));
    }
  }, [dispatch, stockSymbol, selectedInterval]);

  // 4. CHART DATA TRANSFORMATION (Crucial for 1Y view)
  const chartData = useMemo(() => {
    const history = stockHistory[stockSymbol]?.[selectedInterval];

    // Safety check: ensure history is an array
    if (!Array.isArray(history) || history.length === 0) return [];

    return history.map((point) => {
      const date = new Date(point.timestamp);
      let label = "";

      // FORMAT X-AXIS LABELS BASED ON INTERVAL
      if (selectedInterval === "1D") {
        // For 1 Day: Show Time (10:30 AM)
        label = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      } else if (selectedInterval === "1W" || selectedInterval === "1M") {
        // For 1 Week/Month: Show Date (Jan 15)
        label = date.toLocaleDateString([], { month: "short", day: "numeric" });
      } else {
        // For 1 Year (1Y): Show Date with Year (Jan 15 25) to differentiate
        label = date.toLocaleDateString([], { month: "short", day: "numeric", year: "2-digit" });
      }

      return {
        name: label,        // X-Axis Label
        value: point.price, // Y-Axis Value
        fullDate: date.toLocaleString(), // Extra data for custom tooltips if needed
      };
    });
  }, [stockHistory, stockSymbol, selectedInterval]);

  // 5. UI Derived Values
  const currentPrice = selectedStock?.price || 0;
  const priceChangePercent = selectedStock?.changePercent || 0;
  const isPositive = priceChangePercent >= 0;
  const lastUpdated = selectedStock?.lastUpdated
    ? new Date(selectedStock.lastUpdated).toLocaleTimeString()
    : "--:--";

  const intervals = ["1D", "1W", "1M", "3M", "1Y"];

  // 6. Loading State (Only full screen load on initial visit)
  if (loading && !selectedStock) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Loading Market Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col">
        
        {/* --- HEADER SECTION --- */}
        <header className="border-b bg-card px-6 py-3 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-6">
            {/* Symbol Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-xl font-bold gap-2 px-2 hover:bg-muted/50">
                  {selectedStock?.symbol || stockSymbol}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <Label className="px-2 py-1.5 text-xs text-muted-foreground">Quick Select</Label>
                {["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA"].map((s) => (
                  <DropdownMenuItem key={s} onClick={() => router.push(`/stocks/${s}`)}>
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Price & Change */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold tracking-tight">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <Badge 
                variant="outline"
                className={`flex items-center gap-1 font-mono text-sm border-none px-2 py-0.5 ${
                  isPositive 
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(priceChangePercent).toFixed(2)}%
              </Badge>
            </div>
          </div>

          {/* Interval Selectors */}
          <div className="flex items-center gap-4">
            <div className="flex bg-muted/50 p-1 rounded-lg">
              {intervals.map((interval) => (
                <Button
                  key={interval}
                  variant={selectedInterval === interval ? "outline" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedInterval(interval)}
                  className={`h-7 px-3 text-xs font-medium rounded-md transition-all ${
                    selectedInterval === interval 
                      ? "shadow-sm bg-background text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {interval}
                </Button>
              ))}
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex flex-col items-end text-[10px] text-muted-foreground leading-tight">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> UPDATED</span>
              <span className="font-mono">{lastUpdated}</span>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT LAYOUT --- */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* LEFT: CHART AREA */}
          <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gradient-to-b from-background to-muted/20">
            <Card className="h-full border shadow-sm bg-card/50 backdrop-blur-sm flex flex-col">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">Price Performance</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedStock?.name} • {selectedInterval} View
                    </p>
                  </div>
                </div>
                
                {/* IMPORTANT: 'min-h-0' and 'flex-1' are required here 
                   so the ResponsiveContainer inside AreaChartComponent knows its parent's height.
                */}
                <div className="flex-1 min-h-0 w-full relative">
                  {loading && chartData.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : chartData.length > 0 ? (
                    <AreaChartComponent 
                      data={chartData} 
                      dataKey="value" 
                      name="Price"
                      positiveColor="var(--accent)" 
                      // Height is handled by the parent container now
                      className="h-full w-full"
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3 border-2 border-dashed rounded-xl border-muted/50">
                      <AlertCircle className="h-8 w-8 opacity-20" />
                      <p className="text-sm">No data available for {selectedInterval}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: SIDEBAR (Buy/Sell) */}
          <div className="w-80 xl:w-96 border-l bg-card flex flex-col h-full shadow-xl z-20">
            {/* Stock Info Header */}
            <div className="p-6 xl:p-8 border-b bg-muted/10">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">About Asset</span>
              <h2 className="text-2xl xl:text-3xl font-black mt-2 tracking-tight line-clamp-1" title={selectedStock?.name}>
                {selectedStock?.name || stockSymbol}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="rounded-sm font-normal text-xs px-2">
                  {selectedStock?.sector || "Technology"}
                </Badge>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground font-mono">NASDAQ</span>
              </div>
            </div>

            {/* Trading Form */}
            <div className="flex-1 p-6 xl:p-8 space-y-6 overflow-y-auto">
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Quantity</Label>
                  <span className="text-[10px] text-muted-foreground">Avail: $5,000.00</span>
                </div>
                <div className="relative group">
                  <Input
                    type="number"
                    min="1"
                    max="150"
                    value={tradeQty}
                    onChange={(e) => setTradeQty(e.target.value)}
                    className="text-2xl font-bold h-14 pl-4 pr-16 border-2 focus-visible:ring-2 focus-visible:ring-offset-0 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm pointer-events-none group-focus-within:text-primary">
                    QTY
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="p-5 rounded-xl bg-muted/40 border border-border/50 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Price per share</span>
                  <span className="font-mono">${currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Est. Fee (0.1%)</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    ${(Number(tradeQty) * currentPrice * 0.001).toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-sm">Total Cost</span>
                  <span className="text-xl font-bold tracking-tight text-primary">
                    ${(Number(tradeQty) * currentPrice * 1.001).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid gap-3 pt-4">
                <Button 
                  size="lg" 
                  className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wide shadow-md shadow-emerald-900/10 active:scale-[0.98] transition-all"
                  disabled={loading}
                >
                  BUY {stockSymbol}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-12 border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:border-red-800 font-bold tracking-wide active:scale-[0.98] transition-all"
                  disabled={loading}
                >
                  SELL {stockSymbol}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}