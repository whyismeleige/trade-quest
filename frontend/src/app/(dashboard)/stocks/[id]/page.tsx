"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronDown, 
  Loader2, 
  AlertCircle, 
  Wallet,
  ArrowLeft,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";

// Charts
import { AreaChartComponent } from "@/components/charts/area-chart"; 

// Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchStockDetails, fetchStockHistory } from "@/store/slices/stocks.slice";
import { executeBuyTrade, executeSellTrade } from "@/store/slices/trading.slice";

// Hooks
import { useMarketStream } from "@/hooks/useMarketStream";

export default function StockPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // 1. Activate Live Socket Stream
  useMarketStream();

  const rawId = params.stockid || params.id;
  const stockSymbol = typeof rawId === 'string' ? rawId.toUpperCase() : "AAPL";

  // 2. Local State
  const [tradeQty, setTradeQty] = useState("1");

  // 3. Selectors
  const stockLoading = useAppSelector((state) => state.stocks.loading);
  const selectedStock = useAppSelector((state) => state.stocks.selectedStock);
  
  // ⚡ SIMPLIFIED SELECTOR: Always grab "1D" (Live) data
  const currentChartData = useAppSelector((state) => 
    state.stocks.stockHistory[stockSymbol]?.["1D"] || []
  );

  const { cashBalance } = useAppSelector((state) => state.portfolio);
  const { loading: tradeLoading, error: tradeError } = useAppSelector((state) => state.trading);

  // 4. Initial Load (Hardcoded to '1D' for Live View)
  useEffect(() => {
    if (!stockSymbol) return;
    
    const loadData = async () => {
      const result = await dispatch(fetchStockDetails(stockSymbol));
      
      if (fetchStockDetails.rejected.match(result)) {
        router.push("/?error=stock_not_found");
      } else {
        // Always fetch 1D base data for live view
        dispatch(fetchStockHistory({ symbol: stockSymbol, range: "1D" }));
      }
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockSymbol, router, dispatch]);

  const handleTrade = async (type: "BUY" | "SELL") => {
    const quantity = parseInt(tradeQty);
    if (!stockSymbol || isNaN(quantity) || quantity <= 0) return;
    const action = type === "BUY" ? executeBuyTrade : executeSellTrade;
    await dispatch(action({ symbol: stockSymbol, quantity }));
  };

  // 5. Simple Live Data Formatting
  const formattedChartData = useMemo(() => {
    if (!Array.isArray(currentChartData) || currentChartData.length === 0) return [];

    return currentChartData.map((point) => {
      const date = new Date(point.timestamp);
      return { 
        name: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }), 
        value: point.price, 
        fullDate: date.toLocaleString() 
      };
    });
  }, [currentChartData]); 

  // Derived Values
  const currentPrice = selectedStock?.price || 0;
  const priceChangePercent = selectedStock?.changePercent || 0;
  const isPositive = priceChangePercent >= 0;
  const totalCost = (Number(tradeQty) * currentPrice) * 1.001; 
  const canAfford = cashBalance >= totalCost;

  // Loading Screen
  if (stockLoading && !selectedStock) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">Connecting to live market...</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col">
        
        {/* --- STICKY HEADER --- */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md px-4 py-3">
          <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 lg:gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="lg:hidden">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-xl lg:text-3xl font-black p-0 h-auto hover:bg-transparent flex items-center gap-2">
                      {stockSymbol} <ChevronDown className="h-5 w-5 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA"].map((s) => (
                      <DropdownMenuItem key={s} onClick={() => router.push(`/stocks/${s}`)}>{s}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-3">
                  <span className="text-xl lg:text-2xl font-mono font-bold">₹{currentPrice.toFixed(2)}</span>
                  <Badge variant={isPositive ? "default" : "destructive"} className="text-sm font-bold px-2 py-0.5">
                     {isPositive ? "+" : ""}{priceChangePercent.toFixed(2)}%
                  </Badge>
                  <div className="flex items-center gap-1.5 ml-2 text-xs font-bold text-primary animate-pulse">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    LIVE MARKET
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Available Balance</span>
                <span suppressHydrationWarning className="text-lg font-mono font-bold text-primary">
                  ₹{cashBalance.toLocaleString()}
                </span>
              </div>
              <Separator orientation="vertical" className="h-8 hidden sm:block" />
              <div className="bg-primary/10 p-2 rounded-full">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </header>

        {/* --- MAIN LAYOUT --- */}
        <main className="flex-1 flex flex-col lg:flex-row max-w-[1920px] w-full mx-auto">
          
          {/* LEFT: BIG CHART SECTION */}
          <div className="flex-1 p-4 lg:p-6 flex flex-col min-w-0">
            {/* 🚀 MASSIVE CHART CONTAINER */}
            <div className="flex-1 min-h-[500px] lg:min-h-[700px] xl:min-h-[850px] w-full relative bg-card/30 rounded-3xl border border-border/50 p-4 lg:p-8 shadow-inner">
               {formattedChartData.length > 0 ? (
                  <AreaChartComponent 
                    data={formattedChartData} 
                    dataKey="value" 
                    name="Price"
                    positiveColor={isPositive ? "#10b981" : "#ef4444"} 
                    className="h-full w-full"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    {stockLoading ? <Loader2 className="animate-spin h-8 w-8" /> : "Waiting for market tick..."}
                  </div>
                )}
            </div>
          </div>

          {/* RIGHT: TRADING PANEL */}
          <aside className="w-full lg:w-[400px] xl:w-[450px] border-t lg:border-t-0 lg:border-l bg-card/50 backdrop-blur-sm p-6 lg:p-8 space-y-8 flex-shrink-0">
            <section>
              <div className="flex items-center gap-2 mb-6">
                 <Activity className="h-5 w-5 text-muted-foreground" />
                 <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Quick Trade</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-sm font-bold">Quantity</Label>
                    <span className="text-xs text-muted-foreground self-center">Shares to {tradeQty || 0}</span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={tradeQty}
                      onChange={(e) => setTradeQty(e.target.value)}
                      className="text-3xl font-black h-20 bg-background border-2 focus-visible:ring-primary pl-6"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">QTY</span>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-2xl p-6 space-y-4 border border-border/50">
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Current Price</span>
                    <span className="font-mono font-bold">₹{currentPrice.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground font-bold">Total Cost</span>
                    <span className={`font-mono font-black ${!canAfford ? "text-red-500" : "text-primary"}`}>
                      ₹{totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {!canAfford && (
                    <div className="flex items-center justify-end gap-2 text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs font-bold">Insufficient funds</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button 
                onClick={() => handleTrade("BUY")}
                disabled={tradeLoading || !canAfford}
                className="h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl shadow-lg shadow-emerald-500/20"
              >
                {tradeLoading ? <Loader2 className="animate-spin" /> : "BUY NOW"}
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleTrade("SELL")}
                disabled={tradeLoading}
                className="h-16 rounded-2xl border-2 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500 font-black text-xl transition-all"
              >
                SELL NOW
              </Button>
            </div>

            {tradeError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 items-center text-red-500 text-sm font-bold">
                <AlertCircle className="h-5 w-5" /> 
                <span>{tradeError}</span>
              </div>
            )}
          </aside>
        </main>
      </div>
    </TooltipProvider>
  );
}