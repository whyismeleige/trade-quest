"use client"

import Link from "next/link"
import { AnimatedThemeToggler } from "@/components/providers/theme.provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TrendingUp, Trophy, Users, Zap } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">TradeQuest</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth?view=login">
            <Button variant="default">Sign In</Button>
          </Link>
          <Link href="/auth?view=signup">
            <Button variant="default">Register</Button>
          </Link>
          <AnimatedThemeToggler className="rounded-full border p-2 hover:bg-muted transition-colors" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 gap-6 text-center">
        <div className="space-y-4">
          <h2 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Master the Markets
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Compete with students worldwide in a gamified trading league. Learn real trading strategies, build your portfolio, and climb the leaderboard.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/auth">
            <Button size="lg" className="text-lg px-8">
              Start Trading
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="text-lg px-8">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose TradeQuest?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Card className="p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow">
              <TrendingUp className="w-12 h-12 text-primary" />
              <h4 className="text-xl font-semibold">Real Market Data</h4>
              <p className="text-muted-foreground">
                Trade with real-time market data and genuine price movements
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow">
              <Trophy className="w-12 h-12 text-yellow-500" />
              <h4 className="text-xl font-semibold">Compete & Win</h4>
              <p className="text-muted-foreground">
                Climb the global leaderboard and earn badges and rewards
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-blue-500" />
              <h4 className="text-xl font-semibold">Community</h4>
              <p className="text-muted-foreground">
                Join thousands of students and learn from each other
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow">
              <Zap className="w-12 h-12 text-green-500" />
              <h4 className="text-xl font-semibold">Risk-Free Learning</h4>
              <p className="text-muted-foreground">
                Practice trading without real money and gain valuable experience
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl font-bold text-primary">10K+</p>
              <p className="text-lg text-muted-foreground">Active Traders</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-primary">$5M+</p>
              <p className="text-lg text-muted-foreground">Virtual Trading Volume</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-primary">50+</p>
              <p className="text-lg text-muted-foreground">Universities Represented</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h3 className="text-4xl font-bold">Ready to Trade?</h3>
          <p className="text-xl opacity-90">
            Join thousands of students learning to trade. Sign up in minutes and start your journey to becoming a trading expert.
          </p>
          <Link href="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t text-center text-muted-foreground">
        <p>&copy; 2026 TradeQuest. All rights reserved. | Gamified Trading League for Students</p>
      </footer>
    </div>
  )
}