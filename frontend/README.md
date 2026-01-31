# TradeQuest – Frontend

The client-side application for the TradeQuest gamified trading platform. Built with Next.js App Router and powered by Redux for global state and Socket.IO for live market data.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI Library | React 19 |
| State Management | Redux Toolkit + redux-persist |
| Real-time | Socket.IO Client |
| HTTP Client | Axios |
| Charts | Recharts |
| Styling | Tailwind CSS v4 |
| Notifications | react-hot-toast |
| Onboarding | driver.js |
| Celebration | canvas-confetti |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — wraps Providers + Toaster
│   ├── globals.css             # Tailwind config, CSS variables (neubrutalist theme)
│   ├── auth/page.tsx           # Login / Register page
│   └── (dashboard)/
│       ├── layout.tsx          # Collapsible sidebar, mobile sheet nav, top header
│       ├── dashboard/          # Main overview page
│       ├── stocks/             # Marketplace listing + individual stock detail & trading
│       ├── portfolio/          # Holdings, allocation pie chart, recent trades
│       ├── trade-history/      # Full paginated history with filters & CSV export
│       ├── leaderboard/        # League rankings
│       └── achievements/       # Achievement cards with progress
│
├── components/
│   ├── providers/              # Redux, Theme, and Socket providers (app entry wrappers)
│   ├── routes/                 # ProtectedRoute and PublicRoute guards
│   ├── shared/                 # Reusable components (e.g., ExportDialog)
│   └── charts/                 # AreaChart, PieChart, GaugeChart wrappers
│
├── store/
│   ├── index.ts                # Store config, persistence rules per slice
│   ├── hooks.ts                # Typed useAppDispatch / useAppSelector
│   └── slices/                 # One slice per domain (see below)
│
├── hooks/                      # Custom React hooks (see below)
├── lib/
│   ├── api/                    # Axios endpoint modules, one file per resource
│   ├── socket/                 # Socket.IO client instance
│   ├── confetti.ts             # Rarity-scaled confetti on achievement unlock
│   └── driver.ts               # First-visit onboarding tour steps
└── types/                      # Full TypeScript type definitions for every domain
```

---

## Redux Slices

| Slice | Persisted | Responsibility |
|---|---|---|
| `auth` | Yes (localStorage) | User session, login/register/logout thunks |
| `portfolio` | Yes (sessionStorage) | Cash, holdings, live price updates via WebSocket |
| `trading` | No | Buy/sell execution, paginated trade history |
| `stocks` | Watchlist only | Search results, selected stock, chart history, live price stream |
| `leagues` | No | Active leagues, leaderboard, real-time rank updates |
| `achievements` | No | All achievements, stats, recent unlocks, toast + confetti on unlock |

---

## Custom Hooks

| Hook | Purpose |
|---|---|
| `useSocket` | Connects Socket.IO on auth, registers/deregisters the user room |
| `useMarketStream` | Subscribes to the `market-data` room; dispatches `updateLivePrices` on every tick |
| `useLeagueSocket` | Listens for `league_update` events; dispatches `handleLeagueSocketUpdate` |
| `useMounted` | Returns a boolean that flips to `true` after hydration — prevents SSR mismatches |

---

## Page Routes

| Route | Page |
|---|---|
| `/auth` | Login / Register |
| `/dashboard` | Portfolio summary, charts, leaderboard preview, recent trades, achievements |
| `/stocks` | Marketplace — search, grid/list toggle, watchlist stars |
| `/stocks/[id]` | Live chart (1D), price header, buy/sell panel |
| `/portfolio` | Holdings table, allocation pie chart, trade history tab |
| `/trade-history` | Full trade log with symbol/type filters, CSV export |
| `/leaderboard` | Daily / Weekly / Monthly league rankings |
| `/achievements` | All achievements with progress bars |

---

## Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Edit .env — set NEXT_PUBLIC_API_URL to your backend origin (e.g., http://localhost:8080)

# 3. Start dev server
npm run dev
# Runs on http://localhost:3000
```

### Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL (HTTP + Socket.IO) |

---

## Available Scripts

| Script | Action |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint check |