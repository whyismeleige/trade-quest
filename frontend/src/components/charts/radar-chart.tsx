"use client"

import React from "react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export interface RadarDataPoint {
  category: string
  [key: string]: string | number
}

interface RadarChartComponentProps {
  data: RadarDataPoint[]
  dataKey: string
  name?: string
  stroke?: string
  fill?: string
  height?: number
  className?: string
  showLegend?: boolean
  multipleRadars?: Array<{
    dataKey: string
    stroke: string
    fill: string
    name: string
  }>
}

export const RadarChartComponent: React.FC<RadarChartComponentProps> = ({
  data,
  dataKey,
  name = "Performance",
  stroke = "var(--accent)",
  fill = "var(--accent)",
  height = 350,
  className = "",
  showLegend = true,
  multipleRadars,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`w-full flex items-center justify-center h-[200px] text-muted-foreground ${className}`}>
        No radar data available
      </div>
    )
  }

  const CustomTooltip = (props: any) => {
    const { active, payload } = props
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded p-3 shadow-lg">
          <p className="text-sm font-semibold">{payload[0].payload.category}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toFixed(2)}
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
        <RadarChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
          <PolarGrid stroke="var(--border)" strokeOpacity={0.5} />
          <PolarAngleAxis
            dataKey="category"
            stroke="var(--muted-foreground)"
            style={{ fontSize: "11px" }}
            tick={{ fill: "var(--muted-foreground)" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            stroke="var(--muted-foreground)"
            style={{ fontSize: "10px" }}
            tick={{ fill: "var(--muted-foreground)" }}
            tickCount={5}
          />
          <Radar
            name={name}
            dataKey={dataKey}
            stroke={stroke}
            fill={fill}
            fillOpacity={0.5}
            isAnimationActive={true}
            strokeWidth={2}
          />

          {/* Render multiple radars if provided */}
          {multipleRadars &&
            multipleRadars.map((radar, idx) => (
              <Radar
                key={idx}
                name={radar.name}
                dataKey={radar.dataKey}
                stroke={radar.stroke}
                fill={radar.fill}
                fillOpacity={0.25}
                isAnimationActive={true}
                strokeWidth={2}
              />
            ))}

          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend wrapperStyle={{ fontSize: "12px" }} />}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
