"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AnimatedThemeToggler } from "@/components/providers/theme.provider";
import {
  LayoutDashboard,
  TrendingUp,
  Trophy,
  Wallet,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
  Zap,
  Target,
  Users,
  History,
  BookOpen,
  Medal,
  LogOut,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/store/slices/auth.slice";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Trading",
    href: "/stocks",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    icon: <Wallet className="h-5 w-5" />,
  },
  {
    title: "Leaderboard",
    href: "/leaderboard",
    icon: <Trophy className="h-5 w-5" />,
    badge: "Live",
  },
  {
    title: "Trade History",
    href: "/trade-history",
    icon: <History className="h-5 w-5" />,
  },
];

const secondaryNavItems: NavItem[] = [
  {
    title: "Achievements",
    href: "/achievements",
    icon: <Medal className="h-5 w-5" />,
    badge: "3 New",
  },
  {
    title: "Challenges",
    href: "/challenges",
    icon: <Target className="h-5 w-5" />,
  },
  {
    title: "Community",
    href: "/community",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Learn",
    href: "/learn",
    icon: <BookOpen className="h-5 w-5" />,
  },
];

const bottomNavItems: NavItem[] = [
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: "Help & Support",
    href: "/help",
    icon: <HelpCircle className="h-5 w-5" />,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  const { theme } = useTheme();
  console.log("The theme is ", theme);
  const logoSrc = theme === "dark" ? "/favicon-dark.svg" : "/favicon-light.svg";

  return (
    <ProtectedRoute>
      <TooltipProvider delayDuration={0}>
        <div className="flex h-screen overflow-hidden bg-background">
          {/* Sidebar */}
          <aside
            className={cn(
              "hidden md:flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
              collapsed ? "w-[70px]" : "w-[260px]",
            )}
          >
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b px-4">
              {!collapsed && (
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Image
                    src={logoSrc}
                    alt="TradeQuest Logo"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                  <span className="text-xl font-bold">TradeQuest</span>
                </Link>
              )}
              {collapsed && (
                <Link href="/dashboard" className="mx-auto">
                  <Image
                    src={logoSrc}
                    alt="TradeQuest Logo"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                </Link>
              )}
            </div>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1 px-3">
                {!collapsed && (
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Main
                  </p>
                )}
                {mainNavItems.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    collapsed={collapsed}
                  />
                ))}
              </nav>

              <Separator className="my-4" />

              <nav className="space-y-1 px-3">
                {!collapsed && (
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Gamification
                  </p>
                )}
                {secondaryNavItems.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    collapsed={collapsed}
                  />
                ))}
              </nav>

              <Separator className="my-4" />

              <nav className="space-y-1 px-3">
                {bottomNavItems.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    collapsed={collapsed}
                  />
                ))}
              </nav>
            </div>

            {/* User Profile & Collapse Toggle */}
            <div className="border-t p-4">
              {!collapsed ? (
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      PJ
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      Level 12 • 2,450 XP
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCollapsed(true)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      PJ
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCollapsed(false)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Top Header */}
            <header className="flex h-16 items-center justify-end border-b bg-card px-6">
              <div className="flex items-center gap-3">
                {/* Real-time Market Status */}
                <div className="flex items-center gap-2 rounded-lg border bg-green-500/10 px-3 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    Markets Open
                  </span>
                </div>

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        3
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex flex-col items-start gap-1">
                      <span className="font-medium">
                        🎉 Achievement Unlocked!
                      </span>
                      <span className="text-xs text-muted-foreground">
                        You earned &quot;Hot Streak&quot; badge
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start gap-1">
                      <span className="font-medium">📈 AAPL +5.2%</span>
                      <span className="text-xs text-muted-foreground">
                        Your watchlist stock is up
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start gap-1">
                      <span className="font-medium">🏆 New Challenger!</span>
                      <span className="text-xs text-muted-foreground">
                        Sarah is 2 points ahead of you
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <AnimatedThemeToggler className="rounded-lg border p-2 hover:bg-muted transition-colors" />

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar} alt="User" />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          PJ
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/avatars/user.png" alt="User" />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            PJ
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">
                            {user?.name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email || "user@email.com"}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help & Support
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
              {children}
            </main>
          </div>
        </div>
      </TooltipProvider>
    </ProtectedRoute>
  );
}

function NavLink({
  item,
  isActive,
  collapsed,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}) {
  const content = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        collapsed && "justify-center px-2",
      )}
    >
      {item.icon}
      {!collapsed && (
        <>
          <span className="flex-1">{item.title}</span>
          {item.badge && (
            <Badge
              variant={isActive ? "secondary" : "outline"}
              className="text-[10px] px-1.5 py-0"
            >
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {item.title}
          {item.badge && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {item.badge}
            </Badge>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
