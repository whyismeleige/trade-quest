"use client"

import React from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export interface AreaChartDataPoint {
  name: string
  value: number
  [key: string]: string | number
}

interface AreaChartComponentProps {
  data: AreaChartDataPoint[]
  dataKey: string
  name?: string
  positiveColor?: string
  negativeColor?: string
  height?: number
  className?: string
  yAxisLabel?: string
  showGradient?: boolean
  showLegend?: boolean
}

export const AreaChartComponent: React.FC<AreaChartComponentProps> = ({
  data,
  dataKey,
  name = "Growth",
  positiveColor = "var(--accent)",
  negativeColor = "var(--primary)",
  height = 300,
  className = "",
  yAxisLabel = "Value",
  showGradient = true,
  showLegend = false,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`w-full flex items-center justify-center h-[200px] text-muted-foreground ${className}`}>
        No data available
      </div>
    )
  }

  // Check if we have mixed positive/negative data
  const hasNegativeValues = data.some((d) => (d[dataKey] as number) < 0)

  const CustomTooltip = (props: any) => {
    const { active, payload, label } = props
    if (active && payload && payload.length) {
      const value = payload[0].value as number
      const isPositive = value >= 0
      return (
        <div className="bg-background border border-border rounded p-3 shadow-lg">
          <p className="text-sm font-semibold">{label}</p>
          <p
            className={`text-sm font-semibold ${
              isPositive ? "text-accent" : "text-primary"
            }`}
          >
            {name}: ${value.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={`w-full min-h-[200px] ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            {showGradient && (
              <>
                <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={positiveColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={positiveColor} stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={negativeColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={negativeColor} stopOpacity={0.05} />
                </linearGradient>
              </>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
          <XAxis
            dataKey="name"
            stroke="var(--muted-foreground)"
            style={{ fontSize: "11px" }}
            tick={{ fill: "var(--muted-foreground)" }}
            tickLine={{ stroke: "var(--border)" }}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            style={{ fontSize: "11px" }}
            tick={{ fill: "var(--muted-foreground)" }}
            tickLine={{ stroke: "var(--border)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickFormatter={(value) => `$${value}`}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={hasNegativeValues ? "var(--foreground)" : positiveColor}
            fill={showGradient ? "url(#colorPositive)" : positiveColor}
            isAnimationActive={true}
            name={name}
            fillOpacity={1}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
