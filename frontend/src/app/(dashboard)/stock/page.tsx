"use client";

import { useState, useMemo } from "react";
import {
  MousePointer2,
  Crosshair,
  PenTool,
  Ruler,
  Type,
  Smile,
  Grid3X3,
  Layers,
  Eraser,
  Camera,
  Settings,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Search,
  Bell,
  Plus,
  Eye,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
  ShoppingCart,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CandlestickChart } from "@/components/charts";

// Static candlestick data (SSR-safe)
const candleData = [
  { time: "10:30", open: 100.5, high: 102.3, low: 99.8, close: 101.2, volume: 125000 },
  { time: "10:35", open: 101.2, high: 103.1, low: 100.9, close: 102.8, volume: 134000 },
  { time: "10:40", open: 102.8, high: 104.5, low: 102.1, close: 103.9, volume: 156000 },
  { time: "10:45", open: 103.9, high: 105.2, low: 103.2, close: 104.1, volume: 142000 },
  { time: "10:50", open: 104.1, high: 104.8, low: 102.5, close: 102.9, volume: 138000 },
  { time: "10:55", open: 102.9, high: 103.5, low: 101.8, close: 102.2, volume: 129000 },
  { time: "11:00", open: 102.2, high: 104.1, low: 102.0, close: 103.7, volume: 167000 },
  { time: "11:05", open: 103.7, high: 105.3, low: 103.4, close: 104.9, volume: 178000 },
  { time: "11:10", open: 104.9, high: 106.2, low: 104.5, close: 105.8, volume: 189000 },
  { time: "11:15", open: 105.8, high: 107.1, low: 105.2, close: 106.4, volume: 195000 },
  { time: "11:20", open: 106.4, high: 107.8, low: 105.9, close: 107.2, volume: 201000 },
  { time: "11:25", open: 107.2, high: 108.1, low: 106.5, close: 106.9, volume: 187000 },
  { time: "11:30", open: 106.9, high: 107.5, low: 105.8, close: 106.1, volume: 165000 },
  { time: "11:35", open: 106.1, high: 106.8, low: 104.9, close: 105.3, volume: 154000 },
  { time: "11:40", open: 105.3, high: 106.5, low: 105.0, close: 106.2, volume: 148000 },
  { time: "11:45", open: 106.2, high: 107.9, low: 106.0, close: 107.5, volume: 172000 },
  { time: "11:50", open: 107.5, high: 108.8, low: 107.1, close: 108.3, volume: 186000 },
  { time: "11:55", open: 108.3, high: 109.5, low: 108.0, close: 109.1, volume: 198000 },
  { time: "12:00", open: 109.1, high: 110.2, low: 108.8, close: 109.8, volume: 212000 },
  { time: "12:05", open: 109.8, high: 110.9, low: 109.2, close: 110.4, volume: 225000 },
  { time: "12:10", open: 110.4, high: 111.3, low: 109.8, close: 110.1, volume: 208000 },
  { time: "12:15", open: 110.1, high: 110.8, low: 109.1, close: 109.5, volume: 195000 },
  { time: "12:20", open: 109.5, high: 110.2, low: 108.7, close: 109.2, volume: 178000 },
  { time: "12:25", open: 109.2, high: 110.5, low: 109.0, close: 110.1, volume: 182000 },
  { time: "12:30", open: 110.1, high: 111.8, low: 109.8, close: 111.3, volume: 198000 },
  { time: "12:35", open: 111.3, high: 112.5, low: 111.0, close: 112.1, volume: 215000 },
  { time: "12:40", open: 112.1, high: 113.2, low: 111.5, close: 112.8, volume: 228000 },
  { time: "12:45", open: 112.8, high: 113.9, low: 112.2, close: 113.4, volume: 235000 },
  { time: "12:50", open: 113.4, high: 114.1, low: 112.8, close: 113.1, volume: 219000 },
  { time: "12:55", open: 113.1, high: 113.8, low: 112.1, close: 112.5, volume: 198000 },
  { time: "13:00", open: 112.5, high: 113.2, low: 111.8, close: 112.1, volume: 185000 },
  { time: "13:05", open: 112.1, high: 113.5, low: 111.9, close: 113.2, volume: 192000 },
  { time: "13:10", open: 113.2, high: 114.8, low: 113.0, close: 114.3, volume: 218000 },
  { time: "13:15", open: 114.3, high: 115.5, low: 113.9, close: 115.1, volume: 232000 },
  { time: "13:20", open: 115.1, high: 116.2, low: 114.5, close: 115.8, volume: 245000 },
  { time: "13:25", open: 115.8, high: 116.9, low: 115.2, close: 116.4, volume: 258000 },
  { time: "13:30", open: 116.4, high: 117.1, low: 115.8, close: 116.1, volume: 238000 },
  { time: "13:35", open: 116.1, high: 116.8, low: 114.9, close: 115.3, volume: 215000 },
  { time: "13:40", open: 115.3, high: 116.2, low: 115.0, close: 115.9, volume: 198000 },
  { time: "13:45", open: 115.9, high: 117.5, low: 115.5, close: 117.1, volume: 225000 },
  { time: "13:50", open: 117.1, high: 118.3, low: 116.8, close: 117.9, volume: 242000 },
  { time: "13:55", open: 117.9, high: 119.1, low: 117.5, close: 118.6, volume: 268000 },
];

const chartTools = [
  { id: "cursor", icon: MousePointer2, label: "Cursor", description: "Select and move objects" },
  { id: "crosshair", icon: Crosshair, label: "Crosshair", description: "Cross reference price & time" },
  { id: "trendline", icon: PenTool, label: "Trend Line", description: "Draw trend lines" },
  { id: "measure", icon: Ruler, label: "Measure", description: "Measure price and time" },
  { id: "text", icon: Type, label: "Text", description: "Add text annotations" },
  { id: "emoji", icon: Smile, label: "Emoji", description: "Add emoji markers" },
  { id: "patterns", icon: Grid3X3, label: "Patterns", description: "Chart patterns" },
  { id: "fibonacci", icon: Layers, label: "Fibonacci", description: "Fibonacci retracement" },
  { id: "eraser", icon: Eraser, label: "Eraser", description: "Remove drawings" },
  { id: "screenshot", icon: Camera, label: "Screenshot", description: "Take chart screenshot" },
  { id: "settings", icon: Settings, label: "Settings", description: "Chart settings" },
];

const indices = [
  { name: "NIFTY", value: "22,467.50", change: "+0.82%", positive: true },
  { name: "SENSEX", value: "74,011.87", change: "+0.91%", positive: true },
  { name: "BANKNIFTY", value: "47,823.15", change: "-0.23%", positive: false },
];

const watchlistStocks = [
  { symbol: "RELIANCE", price: 2891.45, change: 2.34 },
  { symbol: "TCS", price: 3654.20, change: -1.12 },
  { symbol: "HDFC", price: 1567.80, change: 0.89 },
  { symbol: "INFY", price: 1432.55, change: 1.56 },
  { symbol: "ICICI", price: 1089.30, change: -0.45 },
  { symbol: "SBIN", price: 765.25, change: 3.21 },
  { symbol: "BHARTI", price: 1234.90, change: -0.78 },
  { symbol: "ITC", price: 456.75, change: 0.23 },
];

const orderBook = {
  bids: [
    { price: 118.50, qty: 1500 },
    { price: 118.45, qty: 2300 },
    { price: 118.40, qty: 1800 },
    { price: 118.35, qty: 3200 },
    { price: 118.30, qty: 2100 },
  ],
  asks: [
    { price: 118.70, qty: 1200 },
    { price: 118.75, qty: 2800 },
    { price: 118.80, qty: 1900 },
    { price: 118.85, qty: 2500 },
    { price: 118.90, qty: 3100 },
  ],
};

const positionsData = [
  { symbol: "RELIANCE", qty: 50, avgPrice: 2850.00, ltp: 2891.45, pnl: 2072.50, pnlPercent: 1.45 },
  { symbol: "TCS", qty: 25, avgPrice: 3680.00, ltp: 3654.20, pnl: -645.00, pnlPercent: -0.70 },
  { symbol: "INFY", qty: 100, avgPrice: 1410.00, ltp: 1432.55, pnl: 2255.00, pnlPercent: 1.60 },
  { symbol: "SBIN", qty: 75, avgPrice: 745.00, ltp: 765.25, pnl: 1518.75, pnlPercent: 2.72 },
];

const ordersData = [
  { id: "ORD001", symbol: "HDFC", type: "BUY", qty: 30, price: 1565.00, status: "pending", time: "10:45 AM" },
  { id: "ORD002", symbol: "ICICI", type: "SELL", qty: 50, price: 1092.00, status: "executed", time: "10:32 AM" },
  { id: "ORD003", symbol: "BHARTI", type: "BUY", qty: 40, price: 1230.00, status: "cancelled", time: "10:15 AM" },
  { id: "ORD004", symbol: "ITC", type: "BUY", qty: 100, price: 455.00, status: "pending", time: "09:58 AM" },
  { id: "ORD005", symbol: "RELIANCE", type: "SELL", qty: 20, price: 2900.00, status: "executed", time: "09:45 AM" },
];

const initialAlerts = [
  { id: "ALT001", symbol: "RELIANCE", condition: "above", price: 2950.00, active: true },
  { id: "ALT002", symbol: "TCS", condition: "below", price: 3600.00, active: true },
  { id: "ALT003", symbol: "NIFTY", condition: "above", price: 22500.00, active: false },
  { id: "ALT004", symbol: "SBIN", condition: "below", price: 750.00, active: true },
];

const marketDepth = {
  bids: [
    { price: 118.50, qty: 1500, orders: 12, total: 1500 },
    { price: 118.45, qty: 2300, orders: 18, total: 3800 },
    { price: 118.40, qty: 1800, orders: 15, total: 5600 },
    { price: 118.35, qty: 3200, orders: 24, total: 8800 },
    { price: 118.30, qty: 2100, orders: 16, total: 10900 },
  ],
  asks: [
    { price: 118.70, qty: 1200, orders: 8, total: 1200 },
    { price: 118.75, qty: 2800, orders: 21, total: 4000 },
    { price: 118.80, qty: 1900, orders: 14, total: 5900 },
    { price: 118.85, qty: 2500, orders: 19, total: 8400 },
    { price: 118.90, qty: 3100, orders: 23, total: 11500 },
  ],
};

export default function StockPage() {
  const [selectedTool, setSelectedTool] = useState("cursor");
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [selectedInterval, setSelectedInterval] = useState("5m");
  const [chartType, setChartType] = useState("candle");
  const [rightTab, setRightTab] = useState("watchlist");
  const [alerts, setAlerts] = useState(initialAlerts);
  const [searchQuery, setSearchQuery] = useState("");
  const [newAlert, setNewAlert] = useState({ symbol: "", condition: "above", price: "" });
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [tradeQty, setTradeQty] = useState("1");
  const [tradePrice, setTradePrice] = useState("118.60");
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false);

  const currentPrice = candleData[candleData.length - 1].close;
  const previousPrice = candleData[candleData.length - 2].close;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2);
  const isPositive = priceChange >= 0;

  const intervals = ["1m", "5m", "15m", "30m", "1H", "4H", "1D", "1W"];
  const chartTypes = [
    { id: "candle", label: "Candle" },
    { id: "line", label: "Line" },
    { id: "area", label: "Area" },
  ];

  const filteredWatchlist = useMemo(() => {
    if (!searchQuery) return watchlistStocks;
    return watchlistStocks.filter((stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, active: !alert.active } : alert
      )
    );
  };

  const deleteAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const addAlert = () => {
    if (newAlert.symbol && newAlert.price) {
      const newId = `ALT${String(alerts.length + 1).padStart(3, "0")}`;
      setAlerts((prev) => [
        ...prev,
        {
          id: newId,
          symbol: newAlert.symbol.toUpperCase(),
          condition: newAlert.condition,
          price: parseFloat(newAlert.price),
          active: true,
        },
      ]);
      setNewAlert({ symbol: "", condition: "above", price: "" });
    }
  };

  const totalPnl = positionsData.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalInvestment = positionsData.reduce(
    (sum, pos) => sum + pos.avgPrice * pos.qty,
    0
  );
  const totalPnlPercent = ((totalPnl / totalInvestment) * 100).toFixed(2);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b bg-card px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-lg font-bold gap-2">
                  {selectedStock}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "META"].map((stock) => (
                  <DropdownMenuItem key={stock} onClick={() => setSelectedStock(stock)}>
                    {stock}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">${currentPrice.toFixed(2)}</span>
              <Badge
                variant={isPositive ? "default" : "destructive"}
                className={`${isPositive ? "bg-green-500" : "bg-red-500"} text-white`}
              >
                {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {isPositive ? "+" : ""}{priceChangePercent}%
              </Badge>
            </div>

            <Separator orientation="vertical" className="h-8" />

            <div className="flex items-center gap-1">
              {intervals.map((interval) => (
                <Button
                  key={interval}
                  variant={selectedInterval === interval ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedInterval(interval)}
                  className="px-2 h-7 text-xs"
                >
                  {interval}
                </Button>
              ))}
            </div>

            <Separator orientation="vertical" className="h-8" />

            <div className="flex items-center gap-1">
              {chartTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={chartType === type.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setChartType(type.id)}
                  className="px-2 h-7 text-xs"
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div><span className="text-muted-foreground">O</span> <span className="font-medium">{candleData[candleData.length - 1].open.toFixed(2)}</span></div>
            <div><span className="text-muted-foreground">H</span> <span className="font-medium text-green-500">{candleData[candleData.length - 1].high.toFixed(2)}</span></div>
            <div><span className="text-muted-foreground">L</span> <span className="font-medium text-red-500">{candleData[candleData.length - 1].low.toFixed(2)}</span></div>
            <div><span className="text-muted-foreground">C</span> <span className="font-medium">{candleData[candleData.length - 1].close.toFixed(2)}</span></div>
            <div><span className="text-muted-foreground">V</span> <span className="font-medium">{(candleData[candleData.length - 1].volume / 1000).toFixed(0)}K</span></div>
          </div>

          <div className="flex items-center gap-4">
            {indices.map((index) => (
              <div key={index.name} className="text-sm">
                <span className="text-muted-foreground">{index.name}</span>{" "}
                <span className="font-medium">{index.value}</span>{" "}
                <span className={index.positive ? "text-green-500" : "text-red-500"}>{index.change}</span>
              </div>
            ))}
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-12 border-r bg-card flex flex-col items-center py-2 gap-1">
            {chartTools.map((tool) => (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedTool === tool.id ? "default" : "ghost"}
                    size="icon"
                    className={`h-9 w-9 ${selectedTool === tool.id ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => setSelectedTool(tool.id)}
                  >
                    <tool.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div>
                    <p className="font-medium">{tool.label}</p>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full">
              <CardContent className="p-4 h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    Active Tool: {chartTools.find((t) => t.id === selectedTool)?.label}
                  </Badge>
                  {selectedTool === "crosshair" && <span className="text-xs text-muted-foreground">Move cursor over chart to see crosshair</span>}
                  {selectedTool === "trendline" && <span className="text-xs text-muted-foreground">Click and drag to draw trend line</span>}
                  {selectedTool === "measure" && <span className="text-xs text-muted-foreground">Click two points to measure distance</span>}
                </div>
                <CandlestickChart data={candleData} height={500} />
              </CardContent>
            </Card>
          </div>

          <div className="w-80 border-l bg-card flex flex-col">
            <Tabs value={rightTab} onValueChange={setRightTab} className="flex flex-col h-full">
              <TabsList className="grid w-full grid-cols-5 rounded-none border-b h-12">
                <TabsTrigger value="watchlist" className="text-xs"><Eye className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="positions" className="text-xs"><Wallet className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="orders" className="text-xs"><ShoppingCart className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="depth" className="text-xs"><BarChart3 className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="alerts" className="text-xs"><Bell className="h-4 w-4" /></TabsTrigger>
              </TabsList>

              <TabsContent value="watchlist" className="flex-1 mt-0 overflow-auto">
                <div className="p-2">
                  <div className="relative mb-2">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search stocks..." className="pl-8 h-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    {filteredWatchlist.map((stock) => (
                      <div key={stock.symbol} className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer" onClick={() => setSelectedStock(stock.symbol)}>
                        <span className="font-medium text-sm">{stock.symbol}</span>
                        <div className="text-right">
                          <div className="text-sm">₹{stock.price.toFixed(2)}</div>
                          <div className={`text-xs ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="positions" className="flex-1 mt-0 overflow-auto">
                <div className="p-2">
                  <Card className="mb-3">
                    <CardContent className="p-3">
                      <div className="text-sm text-muted-foreground">Total P&L</div>
                      <div className={`text-xl font-bold ${totalPnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {totalPnl >= 0 ? "+" : ""}₹{totalPnl.toFixed(2)}
                        <span className="text-sm ml-1">({totalPnlPercent}%)</span>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="space-y-2">
                    {positionsData.map((position) => (
                      <div key={position.symbol} className="p-2 rounded border bg-muted/30">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{position.symbol}</span>
                          <Badge variant="outline" className="text-xs">{position.qty} qty</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="text-muted-foreground">Avg: ₹{position.avgPrice.toFixed(2)}</div>
                          <div className="text-muted-foreground">LTP: ₹{position.ltp.toFixed(2)}</div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">P&L</span>
                          <span className={`text-sm font-medium ${position.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {position.pnl >= 0 ? "+" : ""}₹{position.pnl.toFixed(2)} ({position.pnlPercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="flex-1 mt-0 overflow-auto">
                <div className="p-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Recent Orders</span>
                    <Badge variant="outline" className="text-xs">{ordersData.length} orders</Badge>
                  </div>
                  <div className="space-y-2">
                    {ordersData.map((order) => (
                      <div key={order.id} className="p-2 rounded border bg-muted/30">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{order.symbol}</span>
                            <Badge variant={order.type === "BUY" ? "default" : "destructive"} className={`text-xs ${order.type === "BUY" ? "bg-green-500" : "bg-red-500"}`}>
                              {order.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            {order.status === "pending" && <Clock className="h-3 w-3 text-yellow-500" />}
                            {order.status === "executed" && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                            {order.status === "cancelled" && <XCircle className="h-3 w-3 text-red-500" />}
                            <span className={`text-xs capitalize ${order.status === "pending" ? "text-yellow-500" : order.status === "executed" ? "text-green-500" : "text-red-500"}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{order.qty} @ ₹{order.price.toFixed(2)}</span>
                          <span>{order.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="depth" className="flex-1 mt-0 overflow-auto">
                <div className="p-2">
                  <div className="text-sm font-medium mb-3 text-center">Market Depth - {selectedStock}</div>
                  <div className="grid grid-cols-4 gap-1 text-xs text-muted-foreground mb-2 px-1">
                    <span>Bid</span>
                    <span className="text-right">Qty</span>
                    <span>Ask</span>
                    <span className="text-right">Qty</span>
                  </div>
                  <div className="space-y-1">
                    {marketDepth.bids.map((bid, index) => (
                      <div key={index} className="grid grid-cols-4 gap-1 text-xs relative">
                        <div className="relative">
                          <div className="absolute inset-0 bg-green-500/20 rounded-l" style={{ width: `${(bid.qty / 3500) * 100}%`, right: 0, left: "auto" }} />
                          <span className="relative text-green-500 font-medium">{bid.price.toFixed(2)}</span>
                        </div>
                        <span className="text-right">{bid.qty}</span>
                        <div className="relative">
                          <div className="absolute inset-0 bg-red-500/20 rounded-r" style={{ width: `${(marketDepth.asks[index].qty / 3500) * 100}%` }} />
                          <span className="relative text-red-500 font-medium">{marketDepth.asks[index].price.toFixed(2)}</span>
                        </div>
                        <span className="text-right">{marketDepth.asks[index].qty}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-2 rounded bg-muted/30">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">Total Bid Qty</div>
                        <div className="font-medium text-green-500">{marketDepth.bids.reduce((sum, b) => sum + b.qty, 0).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground">Total Ask Qty</div>
                        <div className="font-medium text-red-500">{marketDepth.asks.reduce((sum, a) => sum + a.qty, 0).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="flex-1 mt-0 overflow-auto">
                <div className="p-2">
                  <Card className="mb-3">
                    <CardContent className="p-3 space-y-2">
                      <div className="text-sm font-medium">Create Alert</div>
                      <div className="flex gap-2">
                        <Input placeholder="Symbol" className="h-8 text-xs" value={newAlert.symbol} onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })} />
                        <select className="h-8 px-2 rounded border bg-background text-xs" value={newAlert.condition} onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}>
                          <option value="above">Above</option>
                          <option value="below">Below</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Price" type="number" className="h-8 text-xs" value={newAlert.price} onChange={(e) => setNewAlert({ ...newAlert, price: e.target.value })} />
                        <Button size="sm" className="h-8" onClick={addAlert}><Plus className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="space-y-2">
                    {alerts.map((alert) => (
                      <div key={alert.id} className={`p-2 rounded border ${alert.active ? "bg-muted/30" : "bg-muted/10 opacity-60"}`}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Bell className={`h-3 w-3 ${alert.active ? "text-yellow-500" : "text-muted-foreground"}`} />
                            <span className="font-medium text-sm">{alert.symbol}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleAlert(alert.id)}>
                              {alert.active ? <Eye className="h-3 w-3" /> : <Eye className="h-3 w-3 opacity-50" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => deleteAlert(alert.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">Price {alert.condition} ₹{alert.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="border-t p-2">
              <div className="text-xs font-medium mb-2">Order Book</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-muted-foreground mb-1">Bids</div>
                  {orderBook.bids.slice(0, 3).map((bid, i) => (
                    <div key={i} className="flex justify-between text-green-500">
                      <span>{bid.price.toFixed(2)}</span>
                      <span>{bid.qty}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Asks</div>
                  {orderBook.asks.slice(0, 3).map((ask, i) => (
                    <div key={i} className="flex justify-between text-red-500">
                      <span>{ask.price.toFixed(2)}</span>
                      <span>{ask.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t p-2 grid grid-cols-2 gap-2">
              <Dialog open={isTradeDialogOpen} onOpenChange={setIsTradeDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => { setTradeType("buy"); setIsTradeDialogOpen(true); }}>
                    <TrendingUp className="h-4 w-4 mr-2" />BUY
                  </Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => { setTradeType("sell"); setIsTradeDialogOpen(true); }}>
                    <TrendingDown className="h-4 w-4 mr-2" />SELL
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className={tradeType === "buy" ? "text-green-500" : "text-red-500"}>
                      {tradeType === "buy" ? "Buy" : "Sell"} {selectedStock}
                    </DialogTitle>
                    <DialogDescription>Place a {tradeType} order for {selectedStock}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="quantity" className="text-right">Quantity</Label>
                      <Input id="quantity" type="number" value={tradeQty} onChange={(e) => setTradeQty(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">Price</Label>
                      <Input id="price" type="number" value={tradePrice} onChange={(e) => setTradePrice(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Total</Label>
                      <div className="col-span-3 font-medium">₹{(parseFloat(tradeQty) * parseFloat(tradePrice)).toFixed(2)}</div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <DialogClose asChild>
                      <Button className={tradeType === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>
                        Confirm {tradeType === "buy" ? "Buy" : "Sell"}
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="border-t bg-card px-4 py-1 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Last Update: {new Date().toLocaleTimeString()}</span>
            <span>Data: Delayed 15min</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Market: Open</span>
            <span>Vol: 2.5M</span>
            <span>Avg Vol: 3.2M</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
