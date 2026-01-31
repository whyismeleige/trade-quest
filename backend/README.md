# TradeQuest – Backend

The server-side API, real-time WebSocket layer, market simulation engine, and scheduled job runner for the TradeQuest platform.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (CommonJS) |
| Framework | Express.js 5 |
| Database | MongoDB (Mongoose) |
| Cache | Redis |
| Real-time | Socket.IO |
| Auth | JWT (httpOnly cookies) + bcrypt |
| Validation | Zod |
| Scheduling | node-cron |
| Testing | Jest + MongoDB Memory Server |

---

## Project Structure

```
backend/
├── server.js                   # App bootstrap: middleware, routes, Socket.IO, simulator start
│
├── database/
│   ├── mongoDB.js              # Mongoose connection
│   └── redis.js                # Redis client (used to cache user lookups in auth middleware)
│
├── models/                     # Mongoose schemas (see Models section below)
│   └── index.js                # Central registry — exports all models as db.*
│
├── controllers/                # Route handlers, one file per resource
├── routes/                     # Express routers, one file per resource
├── middleware/
│   ├── auth.middleware.js      # JWT verification + Redis-cached user lookup
│   ├── validate.middleware.js  # Zod schema validation wrapper
│   ├── asyncHandler.js         # Catches async errors, passes to Express error handler
│   └── errorHandler.js         # Global error handler (Mongo, JWT, validation, etc.)
│
├── services/
│   ├── simulator.service.js    # MarketSimulator — generates price ticks and persists history
│   └── achievement.service.js  # AchievementService — checks & unlocks achievements after actions
│
├── sockets/
│   ├── index.js                # Socket.IO server setup, registers all channel handlers
│   ├── market.socket.js        # market-data room (subscribe / unsubscribe)
│   ├── league.socket.js        # league-<id> rooms (join / leave)
│   └── user.socket.js          # user-<id> rooms (register / deregister)
│
├── jobs/
│   └── leagueScheduler.js      # Cron job — runs daily at midnight (see Scheduler section)
│
├── validators/
│   └── auth.validator.js       # Zod schemas for register & login payloads
│
├── utils/
│   ├── auth.utils.js           # createToken, verifyToken, sanitizeUser, getMetaData (geo + UA)
│   └── error.utils.js          # Custom error classes (ValidationError, NotFoundError, etc.)
│
├── scripts/
│   └── seedData.js             # Seeds 20 stocks, 500 users, portfolios, trades, leagues
│
└── tests/
    ├── jest.config.js
    └── setup/setupTests.js     # MongoMemoryServer, Redis/S3/email mocks, test utilities
```

---

## Models

| Model | Key Fields | Notes |
|---|---|---|
| `User` | email, password, name, avatar, totalPoints, level, currentXp | Auto-hashes password on save; account locks after 5 failed attempts |
| `Stock` | symbol, currentPrice, previousClosePrice, history[] | Text-indexed on symbol + name for search |
| `Portfolio` | userId, cashBalance, holdings[], totalValue | 1:1 with User; created atomically during registration |
| `Trade` | userId, symbol, type (BUY/SELL), quantity, price, totalCost | Auto-calculates totalCost in pre-save hook |
| `League` | name, type (DAILY/WEEKLY/MONTHLY), startDate, endDate, isActive | Managed by the cron scheduler |
| `LeagueEntry` | leagueId, userId, startingValue, currentValue | Virtual `profitLoss`; unique compound index on (leagueId, userId) |
| `Achievement` | achievementId, name, category, rarity, criteria | Static definitions — the "rules" |
| `UserAchievement` | userId, achievementId, progress, isUnlocked | Tracks per-user progress; has an `unlock()` method |

---

## API Routes

All routes except login/register require a valid JWT cookie (`authenticateToken`).

### Auth — `/api/auth`

| Method | Path | Description |
|---|---|---|
| POST | `/register` | Create user + portfolio in a single transaction |
| POST | `/login` | Validate credentials, issue JWT cookie |
| GET | `/profile` | Return sanitized current user |
| POST | `/logout` | Clear JWT cookie |

### Stocks — `/api/stocks`

| Method | Path | Description |
|---|---|---|
| GET | `/search?q=<query>` | Full-text search on symbol and name |
| GET | `/:symbol` | Stock details + last-24h history (aggregation pipeline) |
| GET | `/:symbol/history?range=<1D\|1W\|1M\|1Y\|ALL>` | Filtered price history |

### Trades — `/api/trades`

| Method | Path | Description |
|---|---|---|
| GET | `/` | Trade history (supports symbol, type, page, limit filters) |
| POST | `/buy` | Execute a buy — wrapped in a Mongoose transaction; updates leagues + checks achievements after commit |
| POST | `/sell` | Execute a sell — same transactional + post-commit pattern |

### Portfolio — `/api/portfolio`

| Method | Path | Description |
|---|---|---|
| GET | `/` | Holdings with real-time prices fetched from current Stock documents |

### Leagues — `/api/leagues`

| Method | Path | Description |
|---|---|---|
| GET | `/active` | All leagues where `isActive = true` and `endDate` is in the future |
| GET | `/:id/leaderboard` | Entries sorted by P&L, ranks assigned dynamically |

### Achievements — `/api/achievements`

| Method | Path | Description |
|---|---|---|
| GET | `/` | All achievements merged with current user's progress |
| GET | `/stats` | Totals: points, unlocked count, completion rate |
| GET | `/recent` | Most recently unlocked achievements |
| GET | `/categories` | Achievements grouped by category |
| POST | `/check` | Manually trigger an achievement check for a given type |

---

## WebSocket Channels

The Socket.IO server runs on the same port as the HTTP server.

| Event (client → server) | Effect |
|---|---|
| `register-user` | Joins room `user-<id>` |
| `deregister-user` | Leaves room `user-<id>` |
| `subscribe-market` | Joins room `market-data` |
| `unsubscribe-market` | Leaves room `market-data` |
| `join-league` | Joins room `league-<id>` |
| `leave-league` | Leaves room `league-<id>` |

| Event (server → client) | Payload | Emitted by |
|---|---|---|
| `market-update` | Array of `{ symbol, price, change, timestamp }` | MarketSimulator every 2 s |
| `league_update` | `{ leagueId, userId, currentValue, startingValue }` | trade.controller after every buy/sell |

---

## MarketSimulator

Runs two loops after startup:

1. **Tick loop (every 2 s)** — For each active stock: applies a global sine-wave market cycle, per-stock random walk (-1.5 % to +1.5 %), and a price-gravity correction. Emits the full update array to the `market-data` room. Buffers price points in memory.
2. **Persist loop (every 60 s)** — Bulk-writes buffered price points to MongoDB, capping history at 500 points per stock.

---

## League Scheduler (Cron)

Runs every day at **00:00**:

1. Closes any league whose `endDate` has passed.
2. Creates a new **DAILY** league (always).
3. Creates a new **WEEKLY** league if today is Monday.
4. Creates a new **MONTHLY** league if today is the 1st of the month.

---

## Setup

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Fill in all required variables (see below)

# 3. (Optional) Seed the database
node scripts/seedData.js
# Inserts 20 stocks, 500 users, portfolios, trades, and league entries

# 4. Start the server
node server.js
# Runs on http://localhost:8080 (or the PORT specified in .env)
```

### Required Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default `8080`) |
| `MONGODB_URI` | MongoDB connection string |
| `DB_NAME` | Database name |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` | Redis connection details |
| `JWT_SECRET` | Secret key for signing JWTs |
| `JWT_EXPIRE` | Token expiry (e.g., `7d`) |

---

## Running Tests

```bash
npm test                  # Run all tests
npm test -- --coverage    # Run with coverage report
```

Tests use an in-memory MongoDB instance and mock Redis, S3, and email services (configured in `tests/setup/setupTests.js`).