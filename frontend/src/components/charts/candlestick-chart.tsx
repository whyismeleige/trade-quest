"use client"

import React, { useMemo } from "react"
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceArea,
} from "recharts"

export interface CandleData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

interface CandlestickChartProps {
  data: CandleData[]
  width?: number | string
  height?: number
  className?: string
}

// Transform data to include body height for bar chart
const transformData = (data: CandleData[]) => {
  return data.map(d => ({
    ...d,
    // For the bar, we use the difference between open and close
    bodyLow: Math.min(d.open, d.close),
    bodyHigh: Math.max(d.open, d.close),
    bodyHeight: Math.abs(d.close - d.open),
    isGain: d.close >= d.open,
  }))
}

// Custom shape for candlestick
const Candlestick = (props: any) => {
  const { x, y, width, height, payload } = props
  
  if (!payload) return null
  
  const { open, high, low, close, isGain } = payload
  const color = isGain ? "var(--accent)" : "var(--primary)"
  
  const candleWidth = Math.max(width * 0.7, 3)
  const candleX = x + (width - candleWidth) / 2
  const wickX = x + width / 2
  
  // The y and height from props represent the body
  // We need to calculate wick positions relative to the body
  const bodyTop = y
  const bodyBottom = y + Math.abs(height)
  
  // Calculate the scale: how many pixels per price unit
  // We can derive this from the body dimensions
  const bodyPriceRange = Math.abs(close - open) || 0.01
  const pixelsPerPrice = Math.abs(height) / bodyPriceRange
  
  // Calculate wick positions
  const highPrice = high
  const lowPrice = low
  const bodyHighPrice = Math.max(open, close)
  const bodyLowPrice = Math.min(open, close)
  
  const wickTopY = bodyTop - (highPrice - bodyHighPrice) * pixelsPerPrice
  const wickBottomY = bodyBottom + (bodyLowPrice - lowPrice) * pixelsPerPrice
  
  return (
    <g>
      {/* Upper wick */}
      <line
        x1={wickX}
        y1={wickTopY}
        x2={wickX}
        y2={bodyTop}
        stroke={color}
        strokeWidth={1}
      />
      
      {/* Lower wick */}
      <line
        x1={wickX}
        y1={bodyBottom}
        x2={wickX}
        y2={wickBottomY}
        stroke={color}
        strokeWidth={1}
      />
      
      {/* Body */}
      <rect
        x={candleX}
        y={bodyTop}
        width={candleWidth}
        height={Math.max(Math.abs(height), 2)}
        fill={color}
        stroke={color}
        strokeWidth={1}
        rx={1}
      />
    </g>
  )
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  height = 400,
  className = "",
}) => {
  const transformedData = useMemo(() => transformData(data), [data])
  
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
      const d = payload[0].payload
      return (
        <div className="bg-background border border-border rounded p-3 shadow-lg">
          <p className="text-sm font-semibold">{d.time}</p>
          <p className="text-sm text-muted-foreground">
            O: ${d.open.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            H: ${d.high.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            L: ${d.low.toFixed(2)}
          </p>
          <p
            className={`text-sm font-semibold ${
              d.close >= d.open ? "text-accent" : "text-primary"
            }`}
          >
            C: ${d.close.toFixed(2)}
          </p>
          {d.volume && (
            <p className="text-sm text-muted-foreground">
              Vol: {(d.volume / 1000).toFixed(0)}K
            </p>
          )}
        </div>
      )
    }
    return null
  }

  // Calculate Y domain with some padding
  const minPrice = Math.min(...data.map(d => d.low))
  const maxPrice = Math.max(...data.map(d => d.high))
  const pricePadding = (maxPrice - minPrice) * 0.1
  const yDomain: [number, number] = [minPrice - pricePadding, maxPrice + pricePadding]

  return (
    <div className={`w-full min-h-[200px] ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart 
          data={transformedData} 
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
          <XAxis
            dataKey="time"
            stroke="var(--muted-foreground)"
            style={{ fontSize: "11px" }}
            tick={{ fill: "var(--muted-foreground)" }}
            tickLine={{ stroke: "var(--border)" }}
            axisLine={{ stroke: "var(--border)" }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="var(--muted-foreground)"
            style={{ fontSize: "11px" }}
            tick={{ fill: "var(--muted-foreground)" }}
            tickLine={{ stroke: "var(--border)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
            width={55}
            domain={yDomain}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Candlestick body as stacked bar from bodyLow to bodyHigh */}
          <Bar
            dataKey="bodyHeight"
            stackId="candle"
            shape={<Candlestick />}
            isAnimationActive={false}
          >
            {transformedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={entry.isGain ? "var(--accent)" : "var(--primary)"}
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
