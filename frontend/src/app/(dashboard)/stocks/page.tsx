"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  BarChart3,
  Grid3X3,
  List,
  Loader2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  searchStocks,
  addToWatchlist,
  removeFromWatchlist,
} from "@/store/slices/stocks.slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMarketStream } from "@/hooks/useMarketStream";

export default function MarketplacePage() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useMarketStream();

  // Get data from Redux
  const { searchResults, searchLoading, watchlist } = useAppSelector(
    (state) => state.stocks,
  );

  // Trigger search when user types (debounced or on change)
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(searchStocks(searchQuery || "a")); // Default to 'a' to show some stocks initially
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  const handleWatchlist = (symbol: string) => {
    if (watchlist.includes(symbol)) {
      dispatch(removeFromWatchlist(symbol));
    } else {
      dispatch(addToWatchlist(symbol));
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" /> Marketplace
            </h1>
            <p className="text-sm text-muted-foreground">
              Discover and trade real-time stocks
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-80">
              {searchLoading ? (
                <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              ) : (
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              )}
              <Input
                placeholder="Search symbols (e.g. AAPL)..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <Tabs defaultValue="stocks" className="space-y-4">
            <TabsContent value="stocks" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {searchQuery ? "Search Results" : "Top Assets"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {searchResults.length} assets found
                </p>
              </div>

              {viewMode === "grid" ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {searchResults.map((stock) => (
                    <Card
                      key={stock.symbol}
                      className="hover:border-primary transition-colors overflow-hidden"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center font-bold text-xs">
                              {stock.symbol.slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold">{stock.symbol}</p>
                              <p className="text-xs text-muted-foreground truncate w-24">
                                {stock.name}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleWatchlist(stock.symbol)}
                          >
                            <Star
                              className={`h-4 w-4 ${watchlist.includes(stock.symbol) ? "fill-yellow-500 text-yellow-500" : ""}`}
                            />
                          </Button>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-xl font-bold">
                              ₹{stock.currentPrice.toFixed(2)}
                            </p>
                            <p
                              className={`text-xs font-medium ${stock.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}
                            >
                              {stock.changePercent >= 0 ? "+" : ""}
                              {stock.changePercent.toFixed(2)}%
                            </p>
                          </div>
                          <Link href={`/stocks/${stock.symbol}`}>
                            <Button size="sm">Trade</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="overflow-hidden">
                  <div className="divide-y">
                    {searchResults.map((stock) => (
                      <div
                        key={stock.symbol}
                        className="flex items-center justify-between p-4 hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleWatchlist(stock.symbol)}
                          >
                            <Star
                              className={`h-4 w-4 ${watchlist.includes(stock.symbol) ? "fill-yellow-500 text-yellow-500" : ""}`}
                            />
                          </Button>
                          <div className="font-bold w-12">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground hidden md:block">
                            {stock.name}
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-bold">
                              ₹{stock.currentPrice.toFixed(2)}
                            </p>
                            <p
                              className={`text-xs ${stock.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}
                            >
                              {stock.changePercent >= 0 ? "+" : ""}
                              {stock.changePercent.toFixed(2)}%
                            </p>
                          </div>
                          <Link href={`/stock/${stock.symbol}`}>
                            <Button size="sm" variant="outline">
                              Trade
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {searchResults.length === 0 && !searchLoading && (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">
                    No stocks found matching your search.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
      </div>
    </TooltipProvider>
  );
}
