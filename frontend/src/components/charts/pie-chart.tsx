"use client"

import React from "react"
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export interface PieChartDataPoint {
  name: string
  value: number
  color?: string
}

interface PieChartComponentProps {
  data: PieChartDataPoint[]
  height?: number
  className?: string
  type?: "pie" | "donut"
  colors?: string[]
  showLabels?: boolean
  showLegend?: boolean
}

const DEFAULT_COLORS = [
  "var(--primary)",
  "var(--secondary)",
  "var(--accent)",
  "var(--muted-foreground)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--foreground)",
]

export const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  height = 280,
  className = "",
  type = "pie",
  colors = DEFAULT_COLORS,
  showLabels = true,
  showLegend = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`w-full flex items-center justify-center h-[200px] text-muted-foreground ${className}`}>
        No data available
      </div>
    )
  }

  const CustomTooltip = (props: any) => {
    const { active, payload } = props
    if (active && payload && payload[0]) {
      const data = payload[0].payload
      const total = (payload as any[]).reduce((sum, item) => sum + item.value, 0)
      const percentage = ((data.value / total) * 100).toFixed(1)
      return (
        <div className="bg-background border border-border rounded p-3 shadow-lg">
          <p className="text-sm font-semibold">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Value: ${data.value.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">Allocation: {percentage}%</p>
        </div>
      )
    }
    return null
  }

  const chartData = data.map((item, idx) => ({
    ...item,
    fill: item.color || colors[idx % colors.length],
  }))

  // Calculate responsive radius based on height
  const baseRadius = Math.min(height * 0.35, 100)
  const outerRadius = type === "donut" ? baseRadius : baseRadius * 0.85
  const innerRadius = type === "donut" ? baseRadius * 0.5 : 0

  return (
    <div className={`w-full min-h-[200px] ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart margin={{ top: 5, right: 5, left: 5, bottom: showLegend ? 30 : 5 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={showLabels ? ({ name, percent }) => {
              const percentValue = percent ?? 0
              if (percentValue < 0.05) return null // Hide labels for small slices
              return `${(percentValue * 100).toFixed(0)}%`
            } : false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
            isAnimationActive={true}
            paddingAngle={2}
            stroke="var(--background)"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend 
              verticalAlign="bottom" 
              height={30}
              wrapperStyle={{ fontSize: "12px" }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
