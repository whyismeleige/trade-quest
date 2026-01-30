"use client"

import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

export interface BarChartDataPoint {
  name: string
  value: number
  [key: string]: string | number
}

interface BarChartComponentProps {
  data: BarChartDataPoint[]
  dataKey: string
  name?: string
  fill?: string
  height?: number
  className?: string
  yAxisLabel?: string
  layout?: "vertical" | "horizontal"
  showColors?: boolean
  showLegend?: boolean
}

export const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  dataKey,
  name = "Value",
  fill = "var(--accent)",
  height = 300,
  className = "",
  yAxisLabel = "Value",
  layout = "horizontal",
  showColors = false,
  showLegend = false,
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
      const value = data[dataKey] as number
      return (
        <div className="bg-background border border-border rounded p-3 shadow-lg">
          <p className="text-sm font-semibold">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {name}: ${value.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  // Generate colors based on values
  const getColor = (value: number) => {
    if (!showColors) return fill
    if (value > 0) return "var(--accent)" // blue for positive
    if (value < 0) return "var(--primary)" // red for negative
    return "var(--muted-foreground)" // muted for zero
  }

  return (
    <div className={`w-full min-h-[200px] ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={layout}
          margin={layout === "vertical" 
            ? { top: 10, right: 10, left: 10, bottom: 0 }
            : { top: 10, right: 10, left: -10, bottom: 0 }
          }
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
          <XAxis
            type={layout === "vertical" ? "number" : "category"}
            dataKey={layout === "vertical" ? undefined : "name"}
            stroke="var(--muted-foreground)"
            style={{ fontSize: "11px" }}
            tick={{ fill: "var(--muted-foreground)" }}
            tickLine={{ stroke: "var(--border)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickFormatter={layout === "vertical" ? (value) => `$${value}` : undefined}
          />
          <YAxis
            type={layout === "vertical" ? "category" : "number"}
            dataKey={layout === "vertical" ? "name" : undefined}
            stroke="var(--muted-foreground)"
            style={{ fontSize: "11px" }}
            tick={{ fill: "var(--muted-foreground)" }}
            tickLine={{ stroke: "var(--border)" }}
            axisLine={{ stroke: "var(--border)" }}
            width={layout === "vertical" ? 80 : 60}
            tickFormatter={layout === "horizontal" ? (value) => `$${value}` : undefined}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          <Bar
            dataKey={dataKey}
            fill={fill}
            isAnimationActive={true}
            name={name}
            radius={layout === "vertical" ? [0, 4, 4, 0] : [4, 4, 0, 0]}
          >
            {showColors &&
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry[dataKey] as number)} />
              ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
