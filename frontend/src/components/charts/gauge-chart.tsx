"use client"

import React, { useMemo } from "react"

interface GaugeChartProps {
  value: number // 0-100
  max?: number
  label?: string
  color?: string
  backgroundColor?: string
  showPercentage?: boolean
  size?: number
  className?: string
  sections?: Array<{
    min: number
    max: number
    color: string
    label: string
  }>
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  max = 100,
  label = "Progress",
  color = "var(--accent)",
  backgroundColor = "var(--muted)",
  showPercentage = true,
  size = 160,
  className = "",
  sections,
}) => {
  const percentage = useMemo(() => {
    const normalized = Math.min(Math.max(value / max, 0), 1)
    return normalized * 100
  }, [value, max])

  // Determine color based on sections or value
  const getColor = (): string => {
    if (sections) {
      const section = sections.find((s) => value >= s.min && value <= s.max)
      return section?.color || color
    }

    // Default color scheme based on percentage
    if (percentage >= 75) return "var(--accent)" // Blue - excellent
    if (percentage >= 50) return "var(--secondary)" // Yellow - good
    if (percentage >= 25) return "var(--chart-3)" // Orange - warning
    return "var(--primary)" // Red - needs attention
  }

  const displayColor = getColor()
  const radius = size * 0.35
  const strokeWidth = Math.max(6, size * 0.05)
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const centerX = size / 2
  const centerY = size / 2

  // Responsive font sizes
  const valueFontSize = Math.max(16, size * 0.18)
  const labelFontSize = Math.max(10, size * 0.09)

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={displayColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transform: `rotate(-90deg)`,
            transformOrigin: `${centerX}px ${centerY}px`,
            transition: "stroke-dashoffset 0.5s ease",
          }}
        />

        {/* Center text */}
        <text
          x={centerX}
          y={centerY - size * 0.04}
          textAnchor="middle"
          fontSize={valueFontSize}
          fontWeight="bold"
          fill="var(--foreground)"
        >
          {showPercentage ? `${Math.round(percentage)}%` : Math.round(value)}
        </text>

        <text
          x={centerX}
          y={centerY + size * 0.12}
          textAnchor="middle"
          fontSize={labelFontSize}
          fill="var(--muted-foreground)"
        >
          {label}
        </text>
      </svg>

      {/* Section legend if provided */}
      {sections && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {sections.map((section, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: section.color,
                  borderRadius: "2px",
                }}
              ></div>
              <span className="text-muted-foreground">{section.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
