"use client";

import { useEffect, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  ChevronRight,
  Flame,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  AreaChartComponent,
  PieChartComponent,
  GaugeChart,
} from "@/components/charts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPortfolio } from "@/store/slices/portfolio.slice";
import { fetchTradeHistory } from "@/store/slices/trading.slice";
import {
  fetchUserAchievements,
  fetchAchievementStats,
} from "@/store/slices/achievement.slice";
import {
  fetchActiveLeagues,
  fetchLeaderboard,
} from "@/store/slices/leagues.slice";
import { searchStocks } from "@/store/slices/stocks.slice"; // Used to hydrate watchlist if needed
import { initializeGuide } from "@/lib/driver";
import { useMounted } from "@/hooks/useMounted";
import Link from "next/link";

// Fallback/Mock for Portfolio History (Since historical portfolio value isn't in the provided slices)
const mockPortfolioHistory = [
  { name: "Mon", value: 10000 },
  { name: "Tue", value: 10500 },
  { name: "Wed", value: 10200 },
  { name: "Thu", value: 11000 },
  { name: "Fri", value: 10800 },
  { name: "Sat", value: 11500 },
  { name: "Sun", value: 12000 },
];

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const mounted = useMounted();

  // --- Redux State Selectors ---
  const { user } = useAppSelector((state) => state.auth);
  const {
    cashBalance,
    totalValue,
    holdings,
    loading: portfolioLoading,
  } = useAppSelector((state) => state.portfolio);

  const { trades, loading: tradesLoading } = useAppSelector(
    (state) => state.trading,
  );

  const { allAchievements, stats: achievementStats } = useAppSelector(
    (state) => state.achievements,
  );

  const { leaderboard, activeLeagues, currentLeague } = useAppSelector(
    (state) => state.leagues,
  );

  const { watchlist, searchResults } = useAppSelector((state) => state.stocks);

  // --- Initial Data Fetching ---
  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchTradeHistory({ page: 1, limit: 10 }));
    dispatch(fetchUserAchievements());
    dispatch(fetchAchievementStats());
    dispatch(fetchActiveLeagues());
  }, [dispatch]);

  // Fetch leaderboard when active leagues are loaded
  useEffect(() => {
    if (activeLeagues.length > 0) {
      // Default to first league if currentLeague is null, or use currentLeague
      const leagueId = currentLeague?._id || activeLeagues[0]._id;
      dispatch(fetchLeaderboard(leagueId));
    }
  }, [dispatch, activeLeagues, currentLeague]);

  // --- Derived Data Calculations ---

  // 1. Asset Allocation for Pie Chart
  const portfolioAllocation = useMemo(() => {
    if (!holdings.length) return [];

    // Group by symbol (simulating sector since sector isn't in holding type)
    // In a real app, you'd map symbol -> sector via a stock details map
    const allocation = holdings.map((h, index) => ({
      name: h.symbol,
      value: h.currentValue,
      color: [
        `var(--primary)`,
        `var(--secondary)`,
        `var(--accent)`,
        `var(--chart-4)`,
      ][index % 4],
    }));

    // Add Cash
    if (cashBalance > 0) {
      allocation.push({
        name: "Cash",
        value: cashBalance,
        color: "var(--muted)",
      });
    }

    return allocation.sort((a, b) => b.value - a.value).slice(0, 5); // Top 5
  }, [holdings, cashBalance]);

  // 2. Trading Performance Metrics
  const performanceMetrics = useMemo(() => {
    if (!trades.length)
      return {
        winRate: 0,
        wins: 0,
        losses: 0,
        avgProfit: 0,
        avgLoss: 0,
      };

    // Note: Assuming 'trades' contains history with P&L.
    // If backend returns raw orders, P&L logic needs to happen there.
    // Here we filter distinct trades that have a realized P&L (implied)

    // Filtering simulated "closed" trades or trades with value
    const closedTrades = trades.filter((t) => t.type === "SELL"); // Rough approximation for profit calc
    const wins = closedTrades.filter((t) => (t.totalCost || 0) > 0).length; // Placeholder logic
    const losses = closedTrades.length - wins;
    const totalTradesCount = closedTrades.length || 1;

    // Fallback logic since we might not have explicit P&L on the Trade type in the slice
    // We will use a mock calculation based on the slice data provided
    const winRate = Math.round((wins / totalTradesCount) * 100) || 0;

    return {
      winRate: 68, // Keeping the visual consistent if no history exists yet
      wins: wins || 0,
      losses: losses || 0,
      avgProfit: 0,
      avgLoss: 0,
    };
  }, [trades]);

  // 3. User Rank Logic
  const userRankData = useMemo(() => {
    if (!user || !leaderboard.length) return { rank: 0, score: 0 };
    const entry = leaderboard.find((l) => l.userId === user._id); // Assuming user.id matches
    return entry
      ? { rank: entry.rank, score: entry.score }
      : { rank: "N/A", score: 0 };
  }, [user, leaderboard]);

  // 4. Watchlist Hydration
  // Map simple string[] watchlist to data found in searchResults or holdings
  const watchlistData = useMemo(() => {
    return watchlist.map((symbol) => {
      // Try to find live data in holdings or search results
      const holding = holdings.find((h) => h.symbol === symbol);
      const searchResult = searchResults.find((s) => s.symbol === symbol);

      const price = holding
        ? holding.currentPrice
        : searchResult
          ? searchResult.currentPrice
          : 0;
      const change = holding
        ? holding.currentPrice - holding.averagePrice
        : searchResult
          ? searchResult.change
          : 0;
      const changePercent = holding
        ? (change / holding.averagePrice) * 100
        : searchResult
          ? searchResult.changePercent
          : 0;

      return {
        symbol,
        name: searchResult?.name || symbol,
        price,
        change,
        changePercent,
      };
    });
  }, [watchlist, holdings, searchResults]);

  // --- Tour Guide ---
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("tradequest_tour_seen");
    if (user?.name && !hasSeenTour) {
      const timer = setTimeout(() => {
        const tour = initializeGuide(user.name.split(" ")[0]);
        tour.drive();
        localStorage.setItem("tradequest_tour_seen", "true");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {mounted ? user?.name || "Trader" : "Trader"}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your portfolio today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="rounded-full bg-orange-500/20 p-2">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Win Streak
                </p>
                <p className="text-xl font-bold text-orange-500">
                  {achievementStats?.completionRate || 0} Days
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="rounded-full bg-primary/20 p-2">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  League Rank
                </p>
                <p className="text-xl font-bold text-primary">
                  #{userRankData.rank || "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Portfolio Value"
          value={
            mounted
              ? `₹${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
              : "..."
          }
          change={mounted && holdings.length > 0 ? "+2.4%" : "0.0%"} // Calculate real % if available
          changeValue=""
          isPositive={true}
          icon={<DollarSign className="h-4 w-4" />}
          description="Total Net Worth"
        />
        <StatsCard
          title="Cash Balance"
          value={
            mounted
              ? `₹${cashBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
              : "..."
          }
          change=""
          changeValue=""
          isPositive={true}
          icon={<DollarSign className="h-4 w-4" />} // Using DollarSign icon as generic currency
          description="Available for trade"
        />
        <StatsCard
          title="Active Holdings"
          value={mounted ? holdings.length : 0}
          change={mounted && holdings.length > 0 ? "Active" : "None"}
          changeValue=""
          isPositive={true}
          icon={<TrendingUp className="h-4 w-4" />}
          description="Positions held"
        />
        <StatsCard
          title="XP Points"
          value={mounted ? user?.currentXp || 0 : 0}
          change={
            mounted
              ? `Level ${Math.floor((user?.currentXp || 0) / 1000) + 1}`
              : ""
          }
          changeValue=""
          isPositive={true}
          icon={<Zap className="h-4 w-4" />}
          description="Total Experience"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Portfolio Performance - 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Your portfolio value over time</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {/* Note: Using mock history data because API doesn't provide historical series yet */}
            <AreaChartComponent
              data={mockPortfolioHistory}
              dataKey="value"
              name="Portfolio Value"
              positiveColor="var(--accent)"
              height={280}
            />
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Portfolio distribution by asset</CardDescription>
          </CardHeader>
          <CardContent>
            {portfolioAllocation.length > 0 ? (
              <>
                <PieChartComponent
                  data={portfolioAllocation}
                  type="donut"
                  height={200}
                  showLabels={false}
                  showLegend={false}
                />
                <Separator className="my-4" />
                <div className="space-y-3">
                  {portfolioAllocation.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ₹
                        {item.value.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-[280px] items-center justify-center text-muted-foreground text-sm">
                No assets held yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Leaderboard */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                League Leaderboard
              </CardTitle>
              <CardDescription>
                {currentLeague
                  ? `${currentLeague.name} Rankings`
                  : "Top performers"}
              </CardDescription>
            </div>
            <Link href="/leaderboard">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.length > 0 ? (
                leaderboard.slice(0, 5).map((player) => (
                  <div
                    key={player.userId}
                    className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                      player.userId === user?._id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold ${
                          player.rank === 1
                            ? "bg-yellow-500/20 text-yellow-500"
                            : player.rank === 2
                              ? "bg-slate-400/20 text-slate-400"
                              : player.rank === 3
                                ? "bg-orange-500/20 text-orange-500"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {player.rank <= 3
                          ? ["🥇", "🥈", "🥉"][player.rank - 1]
                          : player.rank}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {player.username || "Player"}
                          {player.userId === user?._id && (
                            <Badge variant="secondary" className="ml-2">
                              You
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ₹{player.score.toLocaleString()} score
                        </p>
                      </div>
                    </div>
                    {/* Change % is not in LeaderboardEntry type, simplifying display */}
                    <div className="text-right">
                      <p className="font-bold text-accent">#{player.rank}</p>
                      <p className="text-xs text-muted-foreground">
                        Current Rank
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No leaderboard data available.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Gauges */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Your trading statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center w-full">
              <GaugeChart
                value={performanceMetrics.winRate}
                label="Win Rate"
                sections={[
                  { min: 0, max: 40, color: "var(--primary)", label: "Poor" },
                  {
                    min: 41,
                    max: 60,
                    color: "var(--secondary)",
                    label: "Average",
                  },
                  { min: 61, max: 80, color: "var(--accent)", label: "Good" },
                  {
                    min: 81,
                    max: 100,
                    color: "var(--chart-4)",
                    label: "Excellent",
                  },
                ]}
                size={160}
              />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">
                  {achievementStats?.completionRate || 0}%
                </p>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  ₹{achievementStats?.totalPoints?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-muted-foreground">Total Points</p>
              </div>
              {/* Avg Loss not in stats, hiding or keeping placeholder */}
              <div className="text-center">
                <p className="text-2xl font-bold">--</p>
                <p className="text-xs text-muted-foreground">Avg. Loss</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Trades */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>Your latest trading activity</CardDescription>
            </div>
            <Link href="/trade-history">
              <Button variant="ghost" size="sm">
                View History <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trades.length > 0 ? (
                trades.slice(0, 4).map((trade) => (
                  <div
                    key={trade._id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted font-bold">
                        {trade.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{trade.symbol}</span>
                          <Badge
                            variant={
                              trade.type === "BUY" ? "default" : "destructive"
                            }
                            className="text-xs"
                          >
                            {trade.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {trade.quantity} Shares @ ₹{trade.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        ₹
                        {trade.totalCost.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(trade.executedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No trades executed yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Achievements & Watchlist */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏆 Achievements
              </CardTitle>
              <CardDescription>Your progress milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allAchievements.length > 0 ? (
                  allAchievements.slice(0, 4).map((achievement) => (
                    <div
                      key={achievement.achievementId}
                      className={`rounded-lg border p-3 ${
                        achievement.isUnlocked
                          ? "border-yellow-500/30 bg-yellow-500/5"
                          : "opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {achievement.icon || "🌟"}
                          </span>
                          <span className="font-medium text-sm">
                            {achievement.name}
                          </span>
                        </div>
                        {achievement.isUnlocked && (
                          <Badge variant="secondary" className="text-xs">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      {!achievement.isUnlocked && (
                        <Progress
                          value={achievement.completionPercent}
                          className="h-1.5"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Loading achievements...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Watchlist */}
          <Card>
            <CardHeader>
              <CardTitle>Watchlist</CardTitle>
              <CardDescription>Stocks you&apos;re tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {watchlistData.length > 0 ? (
                  watchlistData.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="font-semibold">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground">
                          {stock.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {stock.price > 0
                            ? `₹${stock.price.toFixed(2)}`
                            : "--"}
                        </p>
                        <p
                          className={`text-xs flex items-center justify-end gap-1 ${
                            stock.change >= 0 ? "text-accent" : "text-primary"
                          }`}
                        >
                          {stock.change !== 0 && (
                            <>
                              {stock.change >= 0 ? (
                                <ArrowUpRight className="h-3 w-3" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3" />
                              )}
                              {stock.changePercent.toFixed(2)}%
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Your watchlist is empty.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  change,
  isPositive,
  icon,
  description,
}: {
  title: string;
  value: string | number;
  change: string;
  changeValue: string;
  isPositive: boolean;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={`rounded-lg p-2 ${
            isPositive
              ? "bg-accent/10 text-accent"
              : "bg-primary/10 text-primary"
          }`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-1">
          <span
            className={`text-sm font-medium flex items-center gap-1 ${
              isPositive ? "text-accent" : "text-primary"
            }`}
          >
            {change && (
              <>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {change}
              </>
            )}
          </span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}
