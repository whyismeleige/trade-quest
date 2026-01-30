// Theme color constants for charts
// Uses CSS variables from globals.css
// Primary: Red, Secondary: Yellow, Accent: Blue, Foreground: White/Black

export const CHART_COLORS = {
  // CSS variable references (for inline styles that support var())
  primary: "var(--primary)",           // Red
  secondary: "var(--secondary)",       // Yellow  
  accent: "var(--accent)",             // Blue
  foreground: "var(--foreground)",     // White (dark) / Black (light)
  background: "var(--background)",
  muted: "var(--muted)",
  mutedForeground: "var(--muted-foreground)",
  border: "var(--border)",
  
  // Chart specific colors from CSS variables
  chart1: "var(--chart-1)",            // Red
  chart2: "var(--chart-2)",            // Yellow
  chart3: "var(--chart-3)",            // Blue
  chart4: "var(--chart-4)",            // Green
  chart5: "var(--chart-5)",            // Purple
}

// Default color palette for pie charts, leaderboards, etc.
// Using theme colors: Red, Yellow, Blue, then variations
export const THEME_PALETTE = [
  "var(--primary)",      // Red
  "var(--secondary)",    // Yellow
  "var(--accent)",       // Blue
  "var(--chart-4)",      // Green
  "var(--chart-5)",      // Purple
]

// For cases where CSS variables don't work (SVG gradients, etc.)
// These are fallback hex values matching the theme
export const THEME_PALETTE_HEX = {
  light: {
    primary: "#ff3333",      // Red
    secondary: "#ffff00",    // Yellow
    accent: "#0066ff",       // Blue
    foreground: "#000000",   // Black
    background: "#ffffff",   // White
  },
  dark: {
    primary: "#ff6666",      // Red (lighter for dark mode)
    secondary: "#ffff33",    // Yellow
    accent: "#3399ff",       // Blue (lighter for dark mode)
    foreground: "#ffffff",   // White
    background: "#000000",   // Black
  }
}

// Semantic colors for trading
export const TRADING_COLORS = {
  gain: "var(--accent)",      // Blue for gains (positive)
  loss: "var(--primary)",     // Red for losses (negative)
  neutral: "var(--secondary)", // Yellow for neutral
  highlight: "var(--foreground)",
}
