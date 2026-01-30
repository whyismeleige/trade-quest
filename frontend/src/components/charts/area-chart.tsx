"use client"

import React, { useMemo } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export interface AreaChartDataPoint {
  name: string
  value: number
  // We allow extra keys (like original timestamp) to be passed through
  [key: string]: any 
}

interface AreaChartComponentProps {
  data: AreaChartDataPoint[]
  dataKey: string
  name?: string
  positiveColor?: string
  negativeColor?: string
  height?: number
  className?: string
  showGradient?: boolean
}

export const AreaChartComponent: React.FC<AreaChartComponentProps> = ({
  data,
  dataKey,
  name = "Price",
  positiveColor = "#10b981", // Emerald 500
  height = 300,
  className = "",
  showGradient = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`w-full flex items-center justify-center h-[${height}px] text-muted-foreground ${className}`}>
        No data available
      </div>
    )
  }

  // 1. DYNAMIC Y-AXIS CALCULATION
  // We calculate this every time 'data' changes to ensure the chart "zooms in"
  const { min, max } = useMemo(() => {
    if (!data.length) return { min: 0, max: 0 };
    
    const values = data.map((d) => d[dataKey] as number);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    // Add 2% padding to top and bottom so the line doesn't touch the edges
    const padding = (maxValue - minValue) * 0.05; 
    
    return {
      min: minValue - padding,
      max: maxValue + padding,
    }
  }, [data, dataKey])

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur border border-border/50 rounded-lg p-3 shadow-xl">
          <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-sm font-bold text-foreground">
            {name}: <span className="text-emerald-500">${payload[0].value.toFixed(2)}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data} 
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          // throttleDelay ensures smooth resizing
          throttleDelay={100} 
        >
          <defs>
            {showGradient && (
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={positiveColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={positiveColor} stopOpacity={0} />
              </linearGradient>
            )}
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
          
          <XAxis
            dataKey="name"
            stroke="var(--muted-foreground)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            minTickGap={50} // Crucial for 1Y data: Prevents label overlap
            tickMargin={10}
          />
          
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toFixed(0)}`} // Show whole numbers on axis to save space
            domain={[min, max]} // Use our calculated Zoomed-In domain
            width={50}
            orientation="right"
          />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
            isAnimationActive={false} // IMPORTANT: Disabling animation makes tooltip snappy on large datasets
          />
          
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={positiveColor}
            fill={showGradient ? "url(#colorPrice)" : positiveColor}
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}