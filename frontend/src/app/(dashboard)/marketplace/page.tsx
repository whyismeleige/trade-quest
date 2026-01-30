"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Star,
  StarOff,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Flame,
  Clock,
  Zap,
  Globe,
  Building2,
  Cpu,
  Stethoscope,
  Car,
  ShoppingBag,
  Landmark,
  Fuel,
  Leaf,
  Bitcoin,
  ChevronRight,
  SlidersHorizontal,
  Grid3X3,
  List,
  Eye,
  Plus,
  Sparkles,
  AlertCircle,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Market categories
const categories = [
  { id: "all", name: "All Markets", icon: Globe },
  { id: "stocks", name: "Stocks", icon: Building2 },
  { id: "tech", name: "Technology", icon: Cpu },
  { id: "healthcare", name: "Healthcare", icon: Stethoscope },
  { id: "automotive", name: "Automotive", icon: Car },
  { id: "consumer", name: "Consumer", icon: ShoppingBag },
  { id: "finance", name: "Finance", icon: Landmark },
  { id: "energy", name: "Energy", icon: Fuel },
  { id: "green", name: "Green Energy", icon: Leaf },
//   { id: "crypto", name: "Crypto", icon: Bitcoin },
];

// Featured stocks
const featuredStocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 189.45,
    change: 2.34,
    changePercent: 1.25,
    volume: "52.3M",
    marketCap: "2.95T",
    category: "tech",
    trending: true,
    logo: "🍎",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp",
    price: 378.92,
    change: 5.67,
    changePercent: 1.52,
    volume: "28.1M",
    marketCap: "2.81T",
    category: "tech",
    trending: true,
    logo: "🪟",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 141.23,
    change: -1.45,
    changePercent: -1.02,
    volume: "31.2M",
    marketCap: "1.78T",
    category: "tech",
    trending: false,
    logo: "🔍",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp",
    price: 495.67,
    change: 12.34,
    changePercent: 2.55,
    volume: "45.8M",
    marketCap: "1.22T",
    category: "tech",
    trending: true,
    logo: "🎮",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 248.32,
    change: -8.92,
    changePercent: -3.47,
    volume: "98.4M",
    marketCap: "789.5B",
    category: "automotive",
    trending: true,
    logo: "⚡",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.56,
    change: 3.21,
    changePercent: 1.83,
    volume: "41.2M",
    marketCap: "1.85T",
    category: "consumer",
    trending: false,
    logo: "📦",
  },
];

// All stocks data
const allStocks = [
  ...featuredStocks,
  {
    symbol: "META",
    name: "Meta Platforms",
    price: 505.23,
    change: 8.45,
    changePercent: 1.70,
    volume: "18.9M",
    marketCap: "1.29T",
    category: "tech",
    trending: false,
    logo: "👤",
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase",
    price: 198.67,
    change: 2.12,
    changePercent: 1.08,
    volume: "8.2M",
    marketCap: "572.3B",
    category: "finance",
    trending: false,
    logo: "🏦",
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    price: 156.78,
    change: -0.89,
    changePercent: -0.56,
    volume: "6.1M",
    marketCap: "378.9B",
    category: "healthcare",
    trending: false,
    logo: "💊",
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    price: 279.45,
    change: 3.78,
    changePercent: 1.37,
    volume: "5.4M",
    marketCap: "573.2B",
    category: "finance",
    trending: false,
    logo: "💳",
  },
  {
    symbol: "PG",
    name: "Procter & Gamble",
    price: 158.92,
    change: 0.67,
    changePercent: 0.42,
    volume: "4.8M",
    marketCap: "374.1B",
    category: "consumer",
    trending: false,
    logo: "🧴",
  },
  {
    symbol: "XOM",
    name: "Exxon Mobil",
    price: 104.56,
    change: -2.34,
    changePercent: -2.19,
    volume: "12.3M",
    marketCap: "416.8B",
    category: "energy",
    trending: false,
    logo: "🛢️",
  },
  {
    symbol: "UNH",
    name: "UnitedHealth Group",
    price: 527.89,
    change: 6.45,
    changePercent: 1.24,
    volume: "3.2M",
    marketCap: "487.2B",
    category: "healthcare",
    trending: false,
    logo: "🏥",
  },
  {
    symbol: "HD",
    name: "Home Depot",
    price: 345.67,
    change: -1.23,
    changePercent: -0.35,
    volume: "4.1M",
    marketCap: "343.5B",
    category: "consumer",
    trending: false,
    logo: "🏠",
  },
  {
    symbol: "ENPH",
    name: "Enphase Energy",
    price: 112.34,
    change: 4.56,
    changePercent: 4.23,
    volume: "7.8M",
    marketCap: "15.2B",
    category: "green",
    trending: true,
    logo: "☀️",
  },
  {
    symbol: "RIVN",
    name: "Rivian Automotive",
    price: 18.92,
    change: 0.89,
    changePercent: 4.93,
    volume: "28.4M",
    marketCap: "18.9B",
    category: "automotive",
    trending: true,
    logo: "🚙",
  },
];

// Crypto data
const cryptoAssets = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 43567.89,
    change: 1234.56,
    changePercent: 2.92,
    volume: "28.4B",
    marketCap: "854.2B",
    category: "crypto",
    trending: true,
    logo: "₿",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 2345.67,
    change: -45.23,
    changePercent: -1.89,
    volume: "12.1B",
    marketCap: "281.5B",
    category: "crypto",
    trending: true,
    logo: "Ξ",
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 98.45,
    change: 5.67,
    changePercent: 6.11,
    volume: "2.3B",
    marketCap: "42.8B",
    category: "crypto",
    trending: true,
    logo: "◎",
  },
  {
    symbol: "ADA",
    name: "Cardano",
    price: 0.52,
    change: 0.02,
    changePercent: 4.00,
    volume: "456.7M",
    marketCap: "18.4B",
    category: "crypto",
    trending: false,
    logo: "₳",
  },
];

// Market movers
const topGainers = allStocks
  .filter((s) => s.changePercent > 0)
  .sort((a, b) => b.changePercent - a.changePercent)
  .slice(0, 5);

const topLosers = allStocks
  .filter((s) => s.changePercent < 0)
  .sort((a, b) => a.changePercent - b.changePercent)
  .slice(0, 5);

const mostActive = [...allStocks].sort((a, b) => {
  const volA = parseFloat(a.volume.replace(/[MB]/g, "")) * (a.volume.includes("B") ? 1000 : 1);
  const volB = parseFloat(b.volume.replace(/[MB]/g, "")) * (b.volume.includes("B") ? 1000 : 1);
  return volB - volA;
}).slice(0, 5);

// Watchlist
const initialWatchlist = ["AAPL", "TSLA", "NVDA", "BTC"];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [watchlist, setWatchlist] = useState(initialWatchlist);
  const [activeTab, setActiveTab] = useState("stocks");

  // Combined assets based on tab
  const currentAssets = useMemo(() => {
    if (activeTab === "crypto") return cryptoAssets;
    return allStocks;
  }, [activeTab]);

  // Filter and sort stocks
  const filteredStocks = useMemo(() => {
    let filtered = currentAssets;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((stock) => stock.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "change-high":
        filtered = [...filtered].sort((a, b) => b.changePercent - a.changePercent);
        break;
      case "change-low":
        filtered = [...filtered].sort((a, b) => a.changePercent - b.changePercent);
        break;
      default:
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [currentAssets, searchQuery, selectedCategory, sortBy]);

  // Toggle watchlist
  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  Marketplace
                </h1>
                <p className="text-sm text-muted-foreground">
                  Discover and trade stocks, ETFs, and crypto
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search stocks, ETFs, crypto..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="change-high">Change: High to Low</SelectItem>
                    <SelectItem value="change-low">Change: Low to High</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-r-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-l-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          {/* Market Overview Cards - Hide when searching */}
          {!searchQuery && (
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">S&P 500</p>
                    <p className="text-2xl font-bold">4,783.45</p>
                  </div>
                  <Badge variant="default" className="bg-green-500">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +1.23%
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">NASDAQ</p>
                    <p className="text-2xl font-bold">15,234.67</p>
                  </div>
                  <Badge variant="default" className="bg-green-500">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +1.87%
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">DOW</p>
                    <p className="text-2xl font-bold">37,892.12</p>
                  </div>
                  <Badge variant="destructive">
                    <TrendingDown className="mr-1 h-3 w-3" />
                    -0.45%
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Bitcoin</p>
                    <p className="text-2xl font-bold">$43,567</p>
                  </div>
                  <Badge variant="default" className="bg-green-500">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +2.92%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          )}

          {/* Market Movers - Hide when searching */}
          {!searchQuery && (
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {/* Top Gainers */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Flame className="h-4 w-4 text-green-500" />
                  Top Gainers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {topGainers.map((stock) => (
                  <Link
                    key={stock.symbol}
                    href={`/stock?symbol=${stock.symbol}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{stock.logo}</span>
                      <div>
                        <p className="font-medium text-sm">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">${stock.price.toFixed(2)}</p>
                      <p className="text-xs text-green-500">+{stock.changePercent.toFixed(2)}%</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Top Losers */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  Top Losers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {topLosers.map((stock) => (
                  <Link
                    key={stock.symbol}
                    href={`/stock?symbol=${stock.symbol}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{stock.logo}</span>
                      <div>
                        <p className="font-medium text-sm">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">${stock.price.toFixed(2)}</p>
                      <p className="text-xs text-red-500">{stock.changePercent.toFixed(2)}%</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Most Active */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Most Active
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mostActive.map((stock) => (
                  <Link
                    key={stock.symbol}
                    href={`/stock?symbol=${stock.symbol}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{stock.logo}</span>
                      <div>
                        <p className="font-medium text-sm">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">${stock.price.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Vol: {stock.volume}</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
          )}

          {/* Categories */}
          <ScrollArea className="w-full whitespace-nowrap mb-6">
            <div className="flex gap-2 pb-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    className="flex-shrink-0"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="stocks">
                <Building2 className="mr-2 h-4 w-4" />
                Stocks
              </TabsTrigger>
              <TabsTrigger value="crypto">
                <Bitcoin className="mr-2 h-4 w-4" />
                Crypto
              </TabsTrigger>
              <TabsTrigger value="watchlist">
                <Star className="mr-2 h-4 w-4" />
                Watchlist
              </TabsTrigger>
            </TabsList>

            {/* Stocks Tab */}
            <TabsContent value="stocks" className="space-y-4">
              {/* Featured Section */}
              {!searchQuery && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    Featured Stocks
                  </h2>
                  <Button variant="ghost" size="sm">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {featuredStocks.slice(0, 3).map((stock) => (
                    <Card key={stock.symbol} className="overflow-hidden hover:border-primary transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-xl">
                              {stock.logo}
                            </div>
                            <div>
                              <CardTitle className="text-base">{stock.symbol}</CardTitle>
                              <CardDescription className="text-xs">{stock.name}</CardDescription>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWatchlist(stock.symbol);
                            }}
                          >
                            {watchlist.includes(stock.symbol) ? (
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-2xl font-bold">${stock.price.toFixed(2)}</p>
                            <div className={`flex items-center text-sm ${stock.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                              {stock.changePercent >= 0 ? (
                                <ArrowUpRight className="h-4 w-4" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4" />
                              )}
                              <span>
                                {stock.changePercent >= 0 ? "+" : ""}
                                {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                              </span>
                            </div>
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            <p>Vol: {stock.volume}</p>
                            <p>MCap: {stock.marketCap}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Link href={`/stock?symbol=${stock.symbol}`} className="w-full">
                          <Button className="w-full" size="sm">
                            <LineChart className="mr-2 h-4 w-4" />
                            Trade
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
              )}

              {/* All Stocks */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">{searchQuery ? "Search Results" : "All Stocks"}</h2>
                  <p className="text-sm text-muted-foreground">{filteredStocks.length} results</p>
                </div>

                {viewMode === "grid" ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredStocks.map((stock) => (
                      <Card key={stock.symbol} className="hover:border-primary transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{stock.logo}</span>
                              <div>
                                <p className="font-semibold">{stock.symbol}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                                  {stock.name}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => toggleWatchlist(stock.symbol)}
                            >
                              {watchlist.includes(stock.symbol) ? (
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-xl font-bold">${stock.price.toFixed(2)}</p>
                              <p
                                className={`text-sm ${
                                  stock.changePercent >= 0 ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                {stock.changePercent >= 0 ? "+" : ""}
                                {stock.changePercent.toFixed(2)}%
                              </p>
                            </div>
                            <Link href={`/stock?symbol=${stock.symbol}`}>
                              <Button size="sm" variant="outline">
                                Trade
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <div className="divide-y">
                      {filteredStocks.map((stock) => (
                        <div
                          key={stock.symbol}
                          className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => toggleWatchlist(stock.symbol)}
                            >
                              {watchlist.includes(stock.symbol) ? (
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </Button>
                            <span className="text-xl">{stock.logo}</span>
                            <div>
                              <p className="font-semibold">{stock.symbol}</p>
                              <p className="text-sm text-muted-foreground">{stock.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <p className="font-semibold">${stock.price.toFixed(2)}</p>
                              <p
                                className={`text-sm ${
                                  stock.changePercent >= 0 ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                {stock.changePercent >= 0 ? "+" : ""}
                                {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                              </p>
                            </div>
                            <div className="text-right text-sm text-muted-foreground hidden md:block">
                              <p>Vol: {stock.volume}</p>
                              <p>MCap: {stock.marketCap}</p>
                            </div>
                            <Link href={`/stock?symbol=${stock.symbol}`}>
                              <Button size="sm">Trade</Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Crypto Tab */}
            <TabsContent value="crypto" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{searchQuery ? "Search Results" : "All Cryptocurrencies"}</h2>
                <p className="text-sm text-muted-foreground">{filteredStocks.length} results</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {filteredStocks.map((crypto) => (
                  <Card key={crypto.symbol} className="hover:border-primary transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-white font-bold">
                            {crypto.logo}
                          </div>
                          <div>
                            <p className="font-semibold">{crypto.symbol}</p>
                            <p className="text-xs text-muted-foreground">{crypto.name}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => toggleWatchlist(crypto.symbol)}
                        >
                          {watchlist.includes(crypto.symbol) ? (
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <p className="text-2xl font-bold">
                          ${crypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm flex items-center ${
                              crypto.changePercent >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {crypto.changePercent >= 0 ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4" />
                            )}
                            {crypto.changePercent >= 0 ? "+" : ""}
                            {crypto.changePercent.toFixed(2)}%
                          </p>
                          <p className="text-xs text-muted-foreground">Vol: {crypto.volume}</p>
                        </div>
                        <Link href={`/stock?symbol=${crypto.symbol}`} className="block">
                          <Button className="w-full" size="sm" variant="outline">
                            <LineChart className="mr-2 h-4 w-4" />
                            Trade
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Crypto Info Banner */}
              <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20">
                      <AlertCircle className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Crypto Trading Notice</p>
                      <p className="text-sm text-muted-foreground">
                        Cryptocurrency trading involves significant risk. Trade responsibly and only invest what you can afford to lose.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Watchlist Tab */}
            <TabsContent value="watchlist" className="space-y-4">
              {watchlist.length === 0 ? (
                <Card className="py-12">
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <Star className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start adding stocks and crypto to track your favorites
                    </p>
                    <Button onClick={() => setActiveTab("stocks")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Browse Stocks
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{searchQuery ? "Search Results" : "Your Watchlist"}</h2>
                    <p className="text-sm text-muted-foreground">
                      {[...allStocks, ...cryptoAssets]
                        .filter((asset) => watchlist.includes(asset.symbol))
                        .filter((asset) =>
                          !searchQuery ||
                          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.name.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length} items
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[...allStocks, ...cryptoAssets]
                      .filter((asset) => watchlist.includes(asset.symbol))
                      .filter((asset) =>
                        !searchQuery ||
                        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((asset) => (
                      <Card key={asset.symbol} className="hover:border-primary transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{asset.logo}</span>
                              <div>
                                <p className="font-semibold">{asset.symbol}</p>
                                <p className="text-xs text-muted-foreground">{asset.name}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => toggleWatchlist(asset.symbol)}
                            >
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            </Button>
                          </div>
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-xl font-bold">
                                ${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </p>
                              <p
                                className={`text-sm ${
                                  asset.changePercent >= 0 ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                {asset.changePercent >= 0 ? "+" : ""}
                                {asset.changePercent.toFixed(2)}%
                              </p>
                            </div>
                            <Link href={`/stock?symbol=${asset.symbol}`}>
                              <Button size="sm">Trade</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}
