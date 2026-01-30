"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { AnimatedThemeToggler } from "@/components/providers/theme.provider"
import {
 LayoutDashboard,
 TrendingUp,
 Trophy,
 Wallet,
 BarChart3,
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
 Store,
 LogOut,
 Menu,
 X,
} from "lucide-react"
import {
 Tooltip,
 TooltipContent,
 TooltipProvider,
 TooltipTrigger,
} from "@/components/ui/tooltip"
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useMounted } from "@/hooks/useMounted"
import {
 Sheet,
 SheetContent,
 SheetHeader,
 SheetTitle,
 SheetTrigger,
} from "@/components/ui/sheet"

interface NavItem {
 title: string
 href: string
 icon: React.ReactNode
 badge?: string
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
]

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
]

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
]

export default function DashboardLayout({
 children,
}: {
 children: React.ReactNode
}) {
 const [collapsed, setCollapsed] = useState(false)
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
 const pathname = usePathname()
 const { resolvedTheme } = useTheme()
 const mounted = useMounted()

 const logoSrc = mounted
   ? (resolvedTheme === "dark" ? "/favicon-dark.svg" : "/favicon-light.svg")
   : "/favicon-light.svg"

 // Close mobile menu when route changes
 React.useEffect(() => {
   setMobileMenuOpen(false)
 }, [pathname])

 return (
   <TooltipProvider delayDuration={0}>
     <div className="flex h-screen overflow-hidden bg-background">
       {/* Mobile Header */}
       <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b bg-card px-4 md:hidden">
         <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
           <SheetTrigger asChild>
             <Button variant="ghost" size="icon" className="h-9 w-9">
               <Menu className="h-4 w-4" />
             </Button>
           </SheetTrigger>
           <SheetContent side="left" className="w-[280px] p-0">
             <SheetHeader className="border-b px-4 py-3">
               <SheetTitle className="flex items-center gap-2">
                 <Image
                   src={logoSrc}
                   alt="TradeQuest Logo"
                   width={28}
                   height={28}
                   className="h-7 w-7"
                 />
                 <span className="text-lg font-bold">TradeQuest</span>
               </SheetTitle>
             </SheetHeader>
             <div className="flex flex-col h-[calc(100vh-60px)]">
               <div className="flex-1 overflow-y-auto py-4">
                 <nav className="space-y-1 px-3">
                   <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                     Main
                   </p>
                   {mainNavItems.map((item) => (
                     <MobileNavLink
                       key={item.href}
                       item={item}
                       isActive={pathname === item.href}
                       onClick={() => setMobileMenuOpen(false)}
                     />
                   ))}
                 </nav>

                 <Separator className="my-4" />

                 <nav className="space-y-1 px-3">
                   <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                     Gamification
                   </p>
                   {secondaryNavItems.map((item) => (
                     <MobileNavLink
                       key={item.href}
                       item={item}
                       isActive={pathname === item.href}
                       onClick={() => setMobileMenuOpen(false)}
                     />
                   ))}
                 </nav>

                 <Separator className="my-4" />

                 <nav className="space-y-1 px-3">
                   {bottomNavItems.map((item) => (
                     <MobileNavLink
                       key={item.href}
                       item={item}
                       isActive={pathname === item.href}
                       onClick={() => setMobileMenuOpen(false)}
                     />
                   ))}
                 </nav>
               </div>

               {/* Mobile User Profile */}
               <div className="border-t p-4">
                 <div className="flex items-center gap-3">
                   <Avatar className="h-10 w-10">
                     <AvatarImage src="/avatars/user.png" alt="User" />
                     <AvatarFallback className="bg-primary/10 text-primary">PJ</AvatarFallback>
                   </Avatar>
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-semibold truncate">Piyush</p>
                     <p className="text-xs text-muted-foreground flex items-center gap-1">
                       <Zap className="h-3 w-3 text-yellow-500" />
                       Level 12 • 2,450 XP
                     </p>
                   </div>
                 </div>
               </div>
             </div>
           </SheetContent>
         </Sheet>

         <Link href="/dashboard" className="flex items-center gap-2">
           <Image
             src={logoSrc}
             alt="TradeQuest Logo"
             width={28}
             height={28}
             className="h-7 w-7"
           />
           <span className="text-lg font-bold">TradeQuest</span>
         </Link>

         <div className="flex items-center gap-1">
           <AnimatedThemeToggler />
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="ghost" size="icon" className="relative h-9 w-9">
                 <Bell className="h-4 w-4" />
                 <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                   3
                 </span>
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-72">
               <DropdownMenuLabel>Notifications</DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem className="flex flex-col items-start gap-1">
                 <span className="font-medium text-sm">🎉 Achievement Unlocked!</span>
                 <span className="text-xs text-muted-foreground">You earned "Hot Streak" badge</span>
               </DropdownMenuItem>
               <DropdownMenuItem className="flex flex-col items-start gap-1">
                 <span className="font-medium text-sm">📈 AAPL +5.2%</span>
                 <span className="text-xs text-muted-foreground">Your watchlist stock is up</span>
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
           
           {/* Mobile User Menu */}
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                 <Avatar className="h-9 w-9">
                   <AvatarImage src="/avatars/user.png" alt="User" />
                   <AvatarFallback className="bg-primary/10 text-primary text-sm">PJ</AvatarFallback>
                 </Avatar>
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-56">
               <DropdownMenuLabel>
                 <div className="flex items-center gap-3">
                   <Avatar className="h-10 w-10">
                     <AvatarImage src="/avatars/user.png" alt="User" />
                     <AvatarFallback className="bg-primary/10 text-primary">PJ</AvatarFallback>
                   </Avatar>
                   <div className="flex flex-col space-y-1">
                     <p className="text-sm font-medium">Piyush</p>
                     <p className="text-xs text-muted-foreground">piyush@example.com</p>
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
               <DropdownMenuItem className="text-red-600">
                 <LogOut className="mr-2 h-4 w-4" />
                 Log out
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
         </div>
       </div>

       {/* Desktop Sidebar */}
       <aside
         className={cn(
           "hidden md:flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
           collapsed ? "w-[70px]" : "w-[260px]"
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
           {!collapsed && (
             <Button
               variant="ghost"
               size="icon"
               className="h-8 w-8"
               onClick={() => setCollapsed(true)}
             >
               <ChevronLeft className="h-4 w-4" />
             </Button>
           )}
         </div>

         {/* Expand Button when collapsed */}
         {collapsed && (
           <div className="flex justify-center py-2 border-b">
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

         {/* User Profile */}
         <div className="border-t p-4">
           {!collapsed ? (
             <div className="flex items-center gap-3">
               <Avatar className="h-10 w-10">
                 <AvatarImage src="/avatars/user.png" alt="User" />
                 <AvatarFallback className="bg-primary/10 text-primary">PJ</AvatarFallback>
               </Avatar>
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-semibold truncate">Piyush</p>
                 <p className="text-xs text-muted-foreground flex items-center gap-1">
                   <Zap className="h-3 w-3 text-yellow-500" />
                   Level 12 • 2,450 XP
                 </p>
               </div>
             </div>
           ) : (
             <div className="flex flex-col items-center">
               <Avatar className="h-10 w-10">
                 <AvatarImage src="/avatars/user.png" alt="User" />
                 <AvatarFallback className="bg-primary/10 text-primary">PJ</AvatarFallback>
               </Avatar>
             </div>
           )}
         </div>
       </aside>

       {/* Main Content */}
       <div className="flex flex-1 flex-col overflow-hidden pt-14 md:pt-0">
         {/* Top Header - Desktop only */}
         <header className="hidden md:flex h-16 items-center justify-end border-b bg-card px-6">
           <div className="flex items-center gap-2">
             {/* Real-time Market Status */}
             <div className="flex items-center gap-2 rounded-lg border bg-green-500/10 px-3 h-9">
               <span className="relative flex h-2 w-2">
                 <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
               </span>
               <span className="text-xs font-medium text-green-600 dark:text-green-400">Markets Open</span>
             </div>

             {/* Notifications */}
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon" className="relative h-9 w-9">
                   <Bell className="h-4 w-4" />
                   <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                     3
                   </span>
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-80">
                 <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem className="flex flex-col items-start gap-1">
                   <span className="font-medium">🎉 Achievement Unlocked!</span>
                   <span className="text-xs text-muted-foreground">You earned "Hot Streak" badge</span>
                 </DropdownMenuItem>
                 <DropdownMenuItem className="flex flex-col items-start gap-1">
                   <span className="font-medium">📈 AAPL +5.2%</span>
                   <span className="text-xs text-muted-foreground">Your watchlist stock is up</span>
                 </DropdownMenuItem>
                 <DropdownMenuItem className="flex flex-col items-start gap-1">
                   <span className="font-medium">🏆 New Challenger!</span>
                   <span className="text-xs text-muted-foreground">Sarah is 2 points ahead of you</span>
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>

             <AnimatedThemeToggler className="h-9 w-9 rounded-lg border flex items-center justify-center hover:bg-muted transition-colors [&_svg]:h-4 [&_svg]:w-4" />

             {/* User Menu */}
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                   <Avatar className="h-9 w-9">
                     <AvatarImage src="/avatars/user.png" alt="User" />
                     <AvatarFallback className="bg-primary/10 text-primary text-sm">PJ</AvatarFallback>
                   </Avatar>
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                 <DropdownMenuLabel>
                   <div className="flex items-center gap-3">
                     <Avatar className="h-10 w-10">
                       <AvatarImage src="/avatars/user.png" alt="User" />
                       <AvatarFallback className="bg-primary/10 text-primary">PJ</AvatarFallback>
                     </Avatar>
                     <div className="flex flex-col space-y-1">
                       <p className="text-sm font-medium">Piyush</p>
                       <p className="text-xs text-muted-foreground">piyush@example.com</p>
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
                 <DropdownMenuItem className="text-red-600">
                   <LogOut className="mr-2 h-4 w-4" />
                   Log out
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           </div>
         </header>

         {/* Page Content */}
         <main className="flex-1 overflow-y-auto bg-muted/30 p-3 sm:p-4 md:p-6">
           {children}
         </main>
       </div>
     </div>
   </TooltipProvider>
 )
}

function NavLink({
 item,
 isActive,
 collapsed,
}: {
 item: NavItem
 isActive: boolean
 collapsed: boolean
}) {
 const content = (
   <Link
     href={item.href}
     className={cn(
       "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
       isActive
         ? "bg-primary text-primary-foreground"
         : "text-muted-foreground hover:bg-muted hover:text-foreground",
       collapsed && "justify-center px-2"
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
 )

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
   )
 }

 return content
}

function MobileNavLink({
 item,
 isActive,
 onClick,
}: {
 item: NavItem
 isActive: boolean
 onClick: () => void
}) {
 return (
   <Link
     href={item.href}
     onClick={onClick}
     className={cn(
       "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
       isActive
         ? "bg-primary text-primary-foreground"
         : "text-muted-foreground hover:bg-muted hover:text-foreground"
     )}
   >
     {item.icon}
     <span className="flex-1">{item.title}</span>
     {item.badge && (
       <Badge
         variant={isActive ? "secondary" : "outline"}
         className="text-[10px] px-1.5 py-0"
       >
         {item.badge}
       </Badge>
     )}
   </Link>
 )
}
