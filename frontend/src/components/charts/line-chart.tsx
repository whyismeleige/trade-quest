"use client"

import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export interface LineChartDataPoint {
  name: string
  value: number
  [key: string]: string | number
}

interface LineChartComponentProps {
  data: LineChartDataPoint[]
  dataKey: string
  name?: string
  stroke?: string
  height?: number
  className?: string
  yAxisLabel?: string
  showLegend?: boolean
}

export const LineChartComponent: React.FC<LineChartComponentProps> = ({
  data,
  dataKey,
  name = "Value",
  stroke = "var(--accent)",
  height = 300,
  className = "",
  yAxisLabel = "Value",
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
    const { active, payload, label } = props
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded p-3 shadow-lg">
          <p className="text-sm font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className={`w-full min-h-[200px] ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            dot={false}
            strokeWidth={2}
            isAnimationActive={true}
            name={name}
            activeDot={{ r: 6, fill: stroke, stroke: "var(--background)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
