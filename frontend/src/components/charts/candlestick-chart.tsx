"use client"

import React from "react"
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
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

// Candlestick renderer - draws OHLC candles
const renderCandlestick = (props: any) => {
  const { x, yAxis, width, data } = props

  if (!data || !yAxis) return null

  return data.map((entry: CandleData, index: number) => {
    const { open, high, low, close } = entry
    const xPos = x(index)
    const yScale = yAxis.scale

    const openY = yScale(open)
    const highY = yScale(high)
    const lowY = yScale(low)
    const closeY = yScale(close)

    const isGain = close >= open
    // Use theme colors: accent (blue) for gain, primary (red) for loss
    const color = isGain ? "var(--accent)" : "var(--primary)"
    const wickColor = isGain ? "var(--accent)" : "var(--primary)"

    const wickX = xPos + width / 2
    const bodyWidth = width * 0.6

    return (
      <g key={index}>
        {/* Wick (high-low line) */}
        <line
          x1={wickX}
          y1={highY}
          x2={wickX}
          y2={lowY}
          stroke={wickColor}
          strokeWidth={1}
        />

        {/* Body (open-close rectangle) */}
        <rect
          x={xPos + (width - bodyWidth) / 2}
          y={Math.min(openY, closeY)}
          width={bodyWidth}
          height={Math.abs(closeY - openY) || 1}
          fill={color}
          stroke={wickColor}
          strokeWidth={1}
        />
      </g>
    )
  })
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  height = 400,
  className = "",
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
      return (
        <div className="bg-background border border-border rounded p-3 shadow-lg">
          <p className="text-sm font-semibold">{data.time}</p>
          <p className="text-sm text-muted-foreground">
            O: ${data.open.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            H: ${data.high.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            L: ${data.low.toFixed(2)}
          </p>
          <p
            className={`text-sm font-semibold ${
              data.close >= data.open ? "text-accent" : "text-primary"
            }`}
          >
            C: ${data.close.toFixed(2)}
          </p>
          {data.volume && (
            <p className="text-sm text-muted-foreground">
              Vol: {(data.volume / 1000000).toFixed(2)}M
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
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
          <XAxis
            dataKey="time"
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

          {/* Candlestick chart using Bar with custom shape */}
          <Bar
            dataKey="close"
            shape={(props: any) => renderCandlestick({ ...props, data })}
            name="Price"
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
