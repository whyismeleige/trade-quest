"use client"

import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

export interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  change?: number
}

interface LeaderboardChartProps {
  data: LeaderboardEntry[]
  height?: number
  className?: string
  maxEntries?: number
}

const COLORS = ["var(--secondary)", "var(--muted-foreground)", "var(--chart-3)", "var(--accent)", "var(--primary)", "var(--chart-1)", "var(--chart-2)", "var(--chart-4)", "var(--chart-5)", "var(--foreground)"]

export const LeaderboardChart: React.FC<LeaderboardChartProps> = ({
  data,
  height = 400,
  className = "",
  maxEntries = 10,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`w-full flex items-center justify-center h-[200px] text-muted-foreground ${className}`}>
        No leaderboard data available
      </div>
    )
  }

  const displayData = data.slice(0, maxEntries).map((entry, idx) => ({
    ...entry,
    displayName: `${entry.rank}. ${entry.name}`,
  }))

  const CustomTooltip = (props: any) => {
    const { active, payload } = props
    if (active && payload && payload[0]) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border rounded p-3 shadow-lg">
          <p className="text-sm font-semibold">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Portfolio Value: ${data.score.toFixed(2)}
          </p>
          {data.change !== undefined && (
            <p
              className={`text-sm font-semibold ${
                data.change >= 0 ? "text-accent" : "text-primary"
              }`}
            >
              Change: {data.change >= 0 ? "+" : ""}{data.change.toFixed(2)}%
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className={`w-full min-h-[200px] ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={displayData}
          layout="vertical"
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} horizontal={false} />
          <XAxis
            type="number"
            stroke="var(--muted-foreground)"
            style={{ fontSize: "11px" }}
            tick={{ fill: "var(--muted-foreground)" }}
            tickLine={{ stroke: "var(--border)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="displayName"
            stroke="var(--muted-foreground)"
            style={{ fontSize: "11px" }}
            tick={{ fill: "var(--muted-foreground)" }}
            tickLine={{ stroke: "var(--border)" }}
            axisLine={{ stroke: "var(--border)" }}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="score"
            fill="var(--accent)"
            radius={[0, 4, 4, 0]}
            isAnimationActive={true}
            name="Portfolio Value"
          >
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
