"use client"

import React, { useMemo } from "react"

export interface HeatmapDataPoint {
  x: string
  y: string
  value: number
}

interface HeatmapChartProps {
  data: HeatmapDataPoint[]
  height?: number
  className?: string
  colorScheme?: "trading" | "gradient"
  title?: string
  cellSize?: "auto" | "small" | "medium" | "large"
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({
  data,
  height = 350,
  className = "",
  colorScheme = "trading",
  title = "Heatmap",
  cellSize = "auto",
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`w-full flex items-center justify-center h-[200px] text-muted-foreground ${className}`}>
        No heatmap data available
      </div>
    )
  }

  // Get unique X and Y values
  const xValues = useMemo(
    () => Array.from(new Set(data.map((d) => d.x))),
    [data]
  )
  const yValues = useMemo(
    () => Array.from(new Set(data.map((d) => d.y))),
    [data]
  )

  // Find min and max values for color scaling
  const minValue = Math.min(...data.map((d) => d.value))
  const maxValue = Math.max(...data.map((d) => d.value))
  const range = maxValue - minValue

  // Get color based on value
  const getColor = (value: number): string => {
    const normalized = (value - minValue) / (range || 1)

    if (colorScheme === "trading") {
      // Blue (positive) to Red (negative) using theme colors
      if (normalized >= 0.5) {
        // Blue zone (positive/gains) - accent color
        const intensity = (normalized - 0.5) * 2
        return `rgba(0, 102, 255, ${0.4 + intensity * 0.6})` // accent blue
      } else {
        // Red zone (negative/losses) - primary color
        const intensity = (0.5 - normalized) * 2
        return `rgba(255, 51, 51, ${0.4 + intensity * 0.6})` // primary red
      }
    } else {
      // Yellow to Blue gradient using theme colors
      if (normalized >= 0.5) {
        const intensity = (normalized - 0.5) * 2
        return `rgba(0, 102, 255, ${0.4 + intensity * 0.6})` // accent blue
      } else {
        const intensity = (0.5 - normalized) * 2
        return `rgba(255, 255, 0, ${0.4 + intensity * 0.6})` // secondary yellow
      }
    }
  }

  // Create a map of data for quick lookup
  const dataMap = new Map(data.map((d) => [`${d.x}-${d.y}`, d]))

  // Calculate cell dimensions based on cellSize prop
  const getCellDimensions = () => {
    switch (cellSize) {
      case "small": return { width: 32, height: 24 }
      case "medium": return { width: 48, height: 32 }
      case "large": return { width: 64, height: 40 }
      default: return { width: 48, height: 32 } // auto
    }
  }
  
  const dimensions = getCellDimensions()
  const cellWidth = dimensions.width
  const cellHeight = dimensions.height

  return (
    <div className={`w-full min-h-[200px] ${className}`}>
      <div className="p-4">
        {title && <h3 className="text-base font-semibold mb-4">{title}</h3>}

        <div className="overflow-x-auto">
          <div style={{ display: "inline-block", minWidth: "100%" }}>
            {/* X-axis labels */}
            <div style={{ display: "flex", marginBottom: "8px", marginLeft: "50px" }}>
              {xValues.map((x) => (
                <div
                  key={x}
                  style={{
                    width: `${cellWidth}px`,
                    marginRight: "2px",
                    textAlign: "center",
                    fontSize: "10px",
                    fontWeight: "500",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {x}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            {yValues.map((y) => (
              <div key={y} style={{ display: "flex", marginBottom: "2px" }}>
                {/* Y-axis label */}
                <div
                  style={{
                    width: "50px",
                    fontSize: "10px",
                    fontWeight: "500",
                    paddingRight: "8px",
                    textAlign: "right",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  {y}
                </div>

                {/* Data cells */}
                {xValues.map((x) => {
                  const cellData = dataMap.get(`${x}-${y}`)
                  const value = cellData?.value ?? 0
                  const color = getColor(value)

                  return (
                    <div
                      key={`${x}-${y}`}
                      style={{
                        width: `${cellWidth}px`,
                        height: `${cellHeight}px`,
                        backgroundColor: color,
                        marginRight: "2px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        borderRadius: "3px",
                        transition: "transform 0.15s ease",
                        fontSize: "9px",
                        fontWeight: "600",
                        color:
                          Math.abs(value - minValue - range / 2) > range / 4
                            ? "white"
                            : "black",
                      }}
                      title={`${x}, ${y}: ${value.toFixed(2)}`}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform =
                          "scale(1.1)"
                        ;(e.currentTarget as HTMLElement).style.zIndex = "10"
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform =
                          "scale(1)"
                        ;(e.currentTarget as HTMLElement).style.zIndex = "1"
                      }}
                    >
                      {cellWidth > 40 ? value.toFixed(1) : ""}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: getColor(maxValue),
                borderRadius: "2px",
              }}
            ></div>
            <span className="text-muted-foreground">High ({maxValue.toFixed(1)})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: getColor(minValue + range / 2),
                borderRadius: "2px",
              }}
            ></div>
            <span className="text-muted-foreground">Mid ({(minValue + range / 2).toFixed(1)})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: getColor(minValue),
                borderRadius: "2px",
              }}
            ></div>
            <span className="text-muted-foreground">Low ({minValue.toFixed(1)})</span>
          </div>
        </div>
      </div>
    </div>
  )
}
