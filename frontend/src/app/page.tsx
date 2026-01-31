"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { AnimatedThemeToggler } from "@/components/providers/theme.provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMounted } from "@/hooks/useMounted";
import PublicRoute from "@/components/routes/PublicRoute";
import {
  TrendingUp,
  Trophy,
  Users,
  Zap,
  Target,
  BookOpen,
  BarChart3,
  Shield,
  Flame,
  Star,
  Medal,
  GraduationCap,
  LineChart,
  PieChart,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Play,
  CheckCircle2,
  Globe,
  Clock,
  Award,
  Rocket,
  Brain,
  MessageSquare,
  Settings,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

// Animated counter component
function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = value;
          const duration = 2000;
          const increment = end / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// Floating animation for decorative elements
function FloatingElement({
  children,
  delay = 0,
  duration = 3,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      animate={{
        y: [0, -20, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// Feature data
const features = [
  {
    icon: LineChart,
    title: "Real-Time Market Simulation",
    description:
      "Practice trading with live price simulations and realistic market conditions",
    color: "text-primary",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Trophy,
    title: "Competitive Leagues",
    description:
      "Join daily, weekly, and monthly trading leagues to compete with peers",
    color: "text-yellow-500",
    gradient: "from-yellow-500/20 to-yellow-500/5",
  },
  {
    icon: Target,
    title: "Achievement System",
    description:
      "Earn XP points and unlock achievements as you progress in your trading journey",
    color: "text-green-500",
    gradient: "from-green-500/20 to-green-500/5",
  },
  {
    icon: GraduationCap,
    title: "Educational Focus",
    description:
      "Learn trading fundamentals and build financial literacy in a safe environment",
    color: "text-blue-500",
    gradient: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: Users,
    title: "Portfolio Tracking",
    description:
      "Track your virtual portfolio performance with detailed analytics and insights",
    color: "text-purple-500",
    gradient: "from-purple-500/20 to-purple-500/5",
  },
  {
    icon: Shield,
    title: "Risk-Free Learning",
    description:
      "Practice with virtual currency - no real money, no financial risk",
    color: "text-cyan-500",
    gradient: "from-cyan-500/20 to-cyan-500/5",
  },
]

// Achievements showcase
const achievements = [
  {
    icon: Rocket,
    name: "First Trade",
    description: "Execute your first trade",
    xp: 50,
    color: "text-blue-500",
  },
  {
    icon: Flame,
    name: "Day Trader",
    description: "Complete 5 trades in one day",
    xp: 200,
    color: "text-orange-500",
  },
  {
    icon: Medal,
    name: "Portfolio Manager",
    description: "Diversify across 5 stocks",
    xp: 250,
    color: "text-yellow-500",
  },
  {
    icon: Brain,
    name: "Momentum Builder",
    description: "Complete 10 total trades",
    xp: 100,
    color: "text-purple-500",
  },
];

// Platform features
const platformFeatures = [
  {
    icon: BarChart3,
    title: "Interactive Charts",
    description: "Visualize price movements with historical data",
  },
  {
    icon: PieChart,
    title: "Portfolio Dashboard",
    description: "Monitor your holdings and track performance",
  },
  {
    icon: Award,
    title: "Achievement Tracking",
    description: "Unlock and display your trading milestones",
  },
  {
    icon: BookOpen,
    title: "Learn by Doing",
    description: "Hands-on experience with simulated trading",
  },
  {
    icon: MessageSquare,
    title: "Real-Time Updates",
    description: "Live price updates via WebSocket connections",
  },
  {
    icon: Settings,
    title: "Customizable Experience",
    description: "Personalize your trading dashboard",
  },
];

// Testimonials
const testimonials = [
  {
    name: "CodeSprint Team",
    role: "Hackathon Project",
    university: "St Joseph's College",
    avatar: "C",
    content:
      "Built in 48 hours, TradeQuest demonstrates how gamification can make financial education engaging and accessible to students.",
    rating: 5,
  },
  {
    name: "ByteMonks Team",
    role: "Development Team",
    university: "Hyderabad",
    avatar: "B",
    content:
      "Our goal was to create a platform where students can learn trading concepts without financial risk while competing with peers.",
    rating: 5,
  },
  {
    name: "Project Vision",
    role: "Educational Platform",
    university: "For Students",
    avatar: "P",
    content:
      "TradeQuest combines competitive gaming elements with practical financial education to help students build confidence in trading.",
    rating: 5,
  },
];

// FAQ data
const faqs = [
  {
    question: "What is TradeQuest?",
    answer:
      "TradeQuest is a gamified virtual trading platform built for the CodeSprint 2026 Hackathon. It helps students learn stock trading through competition and achievements, all without risking real money.",
  },
  {
    question: "Do I need trading experience?",
    answer:
      "Not at all! TradeQuest is designed for students at all levels. Start with $100,000 in virtual currency and learn through hands-on practice in a safe environment.",
  },
  {
    question: "How does the gamification work?",
    answer:
      "Earn XP points by executing trades, completing achievements, and participating in leagues. Level up your profile and compete on leaderboards to showcase your trading skills.",
  },
  {
    question: "Is the trading data realistic?",
    answer:
      "The platform uses simulated market data with realistic price movements. While not real-time market feeds, it provides a practical learning experience for understanding trading dynamics.",
  },
];

// Stats data
const stats = [
  { value: 12, suffix: "", label: "Stock Symbols", icon: BarChart3 },
  {
    value: 100,
    prefix: "$",
    suffix: "K",
    label: "Starting Capital",
    icon: TrendingUp,
  },
  { value: 4, suffix: "+", label: "Achievements", icon: Trophy },
  { value: 3, suffix: "", label: "League Types", icon: Users },
];

// How it works steps
const howItWorksSteps = [
  {
    step: "01",
    title: "Create Account",
    description:
      "Sign up and receive $100,000 in virtual currency to begin your trading journey",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    step: "02",
    title: "Build Portfolio",
    description:
      "Trade stocks, track your portfolio, and learn market strategies risk-free",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
  },
  {
    step: "03",
    title: "Compete & Grow",
    description: "Join leagues, earn achievements, and level up your trading skills",
    icon: Trophy,
    color: "from-orange-500 to-red-500",
  },
];

// Dashboard preview stats
const dashboardStats = [
  { label: "Portfolio", value: "$100,000", change: "Start" },
  { label: "Holdings", value: "0", change: "Begin" },
  { label: "XP Points", value: "0", change: "Level 1" },
];

// Chart bar heights
const chartBarHeights = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95];

export default function Page() {
  const mounted = useMounted();
  const { resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Use scroll without target ref to avoid hydration issues
  const { scrollYProgress } = useScroll();

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, 100]);

  // Reset scroll position on mount/reload
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-2xl font-bold">TradeQuest</div>
      </div>
    );
  }

  return (
    <PublicRoute>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2 group">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={
                      resolvedTheme === "dark"
                        ? "/favicon-dark.svg"
                        : "/favicon-light.svg"
                    }
                    alt="TradeQuest Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </motion.div>
                <span className="text-xl font-bold group-hover:text-primary transition-colors">
                  TradeQuest
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-6">
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#achievements"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Achievements
                </a>
                <a
                  href="#testimonials"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </a>
                <a
                  href="#faq"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </a>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <AnimatedThemeToggler className="rounded-full border p-2 hover:bg-muted transition-colors" />
                <Link href="/auth?view=login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth?view=signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="gap-2">
                      Get Started <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </Link>
              </div>

              <div className="flex md:hidden items-center gap-2">
                <AnimatedThemeToggler className="rounded-full border p-2 hover:bg-muted transition-colors" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t bg-background"
              >
                <div className="px-4 py-4 space-y-3">
                  <a
                    href="#features"
                    className="block py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="block py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How It Works
                  </a>
                  <a
                    href="#achievements"
                    className="block py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Achievements
                  </a>
                  <a
                    href="#testimonials"
                    className="block py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </a>
                  <a
                    href="#faq"
                    className="block py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    FAQ
                  </a>
                  <div className="flex gap-2 pt-2">
                    <Link href="/auth?view=login" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth?view=signup" className="flex-1">
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

          <div className="absolute top-1/4 left-10 hidden lg:block">
            <FloatingElement delay={0}>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </FloatingElement>
          </div>
          <div className="absolute top-1/3 right-10 hidden lg:block">
            <FloatingElement delay={0.5}>
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
            </FloatingElement>
          </div>
          <div className="absolute bottom-1/3 left-20 hidden lg:block">
            <FloatingElement delay={1}>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-500" />
              </div>
            </FloatingElement>
          </div>
          <div className="absolute bottom-1/4 right-20 hidden lg:block">
            <FloatingElement delay={1.5}>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-500" />
              </div>
            </FloatingElement>
          </div>

          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
            className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={fadeInDown} className="flex justify-center">
                <Badge
                  variant="outline"
                  className="px-4 py-1.5 text-sm font-medium gap-2 bg-primary/5 border-primary/20"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  CodeSprint 2026 Hackathon Project
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              >
                <span className="block">Learn Trading.</span>
                <span className="block mt-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Compete. Level Up.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
              >
                A gamified virtual trading platform where students can practice stock trading,
                compete in leagues, earn achievements, and build financial literacy — all without risking real money.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link href="/auth?view=signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6 gap-2 rounded-xl"
                    >
                      <Rocket className="w-5 h-5" />
                      Start Trading Free
                    </Button>
                  </motion.div>
                </Link>
                
              </motion.div>

              <motion.div variants={fadeIn} className="pt-8">
                <div className="flex flex-wrap justify-center items-center gap-6 text-muted-foreground text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Virtual Currency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Real Learning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>No Risk</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-muted-foreground"
            >
              <span className="text-sm">Scroll to explore</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    <AnimatedCounter
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="outline" className="mb-4">
                  Features
                </Badge>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              >
                Built for
                <span className="text-primary"> Student Success</span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                TradeQuest combines gamification with practical trading education
                to help students learn financial concepts through hands-on experience.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="group p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="outline" className="mb-4">
                  How It Works
                </Badge>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              >
                Get Started in{" "}
                <span className="text-primary">3 Easy Steps</span>
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {howItWorksSteps.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="relative"
                >
                  <Card className="p-8 text-center h-full">
                    <div
                      className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center mb-6`}
                    >
                      <item.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-6xl font-bold text-muted-foreground/20 absolute top-4 left-6">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </Card>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideInLeft}
              >
                <Badge variant="outline" className="mb-4">
                  Platform
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Comprehensive Tools for{" "}
                  <span className="text-primary">Learning & Growth</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Built with modern web technologies to provide a seamless
                  trading simulation experience for students.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {platformFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideInRight}
                className="relative"
              >
                <div className="relative rounded-2xl border bg-card shadow-2xl overflow-hidden">
                  <div className="h-8 bg-muted flex items-center gap-2 px-4 border-b">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="h-40 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg flex items-end justify-around p-4">
                      {chartBarHeights.map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="w-4 bg-gradient-to-t from-primary to-primary/50 rounded-t"
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {dashboardStats.map((stat, i) => (
                        <div
                          key={i}
                          className="bg-muted/50 rounded-lg p-3 text-center"
                        >
                          <div className="text-xs text-muted-foreground">
                            {stat.label}
                          </div>
                          <div className="font-bold">{stat.value}</div>
                          <div className="text-xs text-green-500">
                            {stat.change}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
              </motion.div>
            </div>
          </div>
        </section>

        <section id="achievements" className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="outline" className="mb-4">
                  Gamification
                </Badge>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              >
                Unlock Achievements,{" "}
                <span className="text-primary">Track Progress</span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                Earn XP points and unlock achievements as you complete trades,
                diversify your portfolio, and reach new milestones in your trading journey.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {achievements.map((achievement, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <Card className="p-6 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-4 border-2 border-dashed border-muted-foreground/30 group-hover:border-primary/50"
                    >
                      <achievement.icon
                        className={`w-8 h-8 ${achievement.color}`}
                      />
                    </motion.div>
                    <h3 className="font-bold mb-1">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {achievement.description}
                    </p>
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="w-3 h-3" />+{achievement.xp} XP
                    </Badge>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link href="/auth?view=signup">
                <Button size="lg" variant="outline" className="gap-2">
                  Explore Achievement System
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section id="testimonials" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="outline" className="mb-4">
                  About the Project
                </Badge>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              >
                Built by{" "}
                <span className="text-primary">ByteMonks Team</span>
              </motion.h2>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-8 md:p-12 text-center">
                    <div className="flex justify-center mb-6">
                      {[...Array(testimonials[activeTestimonial].rating)].map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="w-6 h-6 text-yellow-500 fill-yellow-500"
                          />
                        ),
                      )}
                    </div>
                    <blockquote className="text-xl md:text-2xl mb-8 text-foreground/90">
                      &ldquo;{testimonials[activeTestimonial].content}&rdquo;
                    </blockquote>
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                        {testimonials[activeTestimonial].avatar}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">
                          {testimonials[activeTestimonial].name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {testimonials[activeTestimonial].role} •{" "}
                          {testimonials[activeTestimonial].university}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === activeTestimonial ? "w-8 bg-primary" : "bg-muted-foreground/30"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="outline" className="mb-4">
                  FAQ
                </Badge>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              >
                Common <span className="text-primary">Questions</span>
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="space-y-4"
            >
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <HelpCircle className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold"
              >
                Start Learning
                <span className="block text-primary mt-2">
                  Trading Today
                </span>
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
              >
                Create your account and begin your journey into the world of stock trading
                with $100,000 in virtual capital. No risk, all learning.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/auth?view=signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6 gap-2 rounded-xl"
                    >
                      <Rocket className="w-5 h-5" />
                      Create Free Account
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/auth?view=login">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-6 gap-2 rounded-xl"
                    >
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div
                variants={fadeIn}
                className="flex flex-wrap justify-center items-center gap-6 text-muted-foreground text-sm pt-4"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Open Source Project</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Built for Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Safe Learning Environment</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <footer className="py-16 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-2 md:col-span-1">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <Image
                    src={
                      resolvedTheme === "dark"
                        ? "/favicon-dark.svg"
                        : "/favicon-light.svg"
                    }
                    alt="TradeQuest Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <span className="text-xl font-bold">TradeQuest</span>
                </Link>
                <p className="text-sm text-muted-foreground">
                  A CodeSprint 2026 hackathon project by ByteMonks team.
                  Building financial literacy through gamification.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a
                      href="#features"
                      className="hover:text-foreground transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#how-it-works"
                      className="hover:text-foreground transition-colors"
                    >
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#achievements"
                      className="hover:text-foreground transition-colors"
                    >
                      Achievements
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/auth"
                      className="hover:text-foreground transition-colors"
                    >
                      Get Started
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Project</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a
                      href="https://github.com/whyismeleige/trade-quest"
                      className="hover:text-foreground transition-colors"
                    >
                      GitHub Repository
                    </a>
                  </li>
                  <li>
                    <a
                      href="#testimonials"
                      className="hover:text-foreground transition-colors"
                    >
                      About Team
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq"
                      className="hover:text-foreground transition-colors"
                    >
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/whyismeleige/trade-quest#readme"
                      className="hover:text-foreground transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Info</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <span className="text-foreground">Team:</span> ByteMonks
                  </li>
                  <li>
                    <span className="text-foreground">College:</span> St Joseph's
                  </li>
                  <li>
                    <span className="text-foreground">Event:</span> CodeSprint 2026
                  </li>
                  <li>
                    <span className="text-foreground">Theme:</span> Stock Market & FinTech
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                &copy; 2026 TradeQuest - ByteMonks Team. Built for CodeSprint Hackathon.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/whyismeleige/trade-quest"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PublicRoute>
  );
}