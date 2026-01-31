# TradeQuest

**Problem Statement ID:** CS06SF
**Team Name:** Byte Monks
**College Name:** St. Joseph's Degree and PG College

---

## Problem Statement

The financial literacy gap among students is a well-documented challenge. Most undergraduate and postgraduate students have limited exposure to how stock markets function, how portfolios are managed, and what strategies lead to informed investment decisions. Existing educational resources tend to be either too theoretical to be engaging or too complex to be accessible. There is a clear need for a platform that places students in a realistic trading environment without exposing them to actual financial risk, while simultaneously motivating sustained engagement through competitive and achievement-based mechanics.

The problem statement as defined by CodeSprint 2026 (CS06SF) calls for a Gamified Virtual Trading League for Students. This requires not merely a stock simulator, but a full-featured platform that simulates live market behavior, allows users to execute trades against that simulation, ranks them competitively within time-bound leagues, and rewards progress through a structured achievement system. The platform must feel responsive and real-time, meaning price updates, leaderboard changes, and portfolio valuations must reflect current market state without requiring manual refreshes.

---

## Proposed Solution

TradeQuest is a full-stack web application that delivers a simulated stock trading environment with real-time market data, competitive league-based rankings, and a gamification layer built around achievements, experience points, and leveling. The platform is architected around three core pillars: accuracy of simulation, immediacy of feedback, and depth of competitive engagement.

The market simulation engine runs server-side on a continuous two-second tick cycle. Each tick recalculates prices for all active stocks using a combination of a global market cycle modeled as a sine wave (to simulate bull and bear periods), per-stock random walk volatility, and a gravity correction mechanism that prevents prices from drifting indefinitely high or low. These price updates are broadcast instantaneously to all connected clients via WebSocket, so every user sees the same market state at the same time. A separate sixty-second persistence loop writes buffered price data to the database, keeping the system both responsive and durable.

Users register on the platform and are automatically provisioned with a portfolio containing a starting cash balance. They can search for stocks, view live price charts, and execute buy or sell orders. Each trade is processed within a database transaction to guarantee atomicity: the portfolio balance, holdings, and trade record are all updated or all rolled back together. After a trade commits, the system automatically enrolls the user into every currently active league (if not already enrolled) and updates their league standing. This lazy-enrollment approach means users begin competing the moment they first trade, without any manual opt-in step.

The league system operates on three time horizons: daily, weekly, and monthly. A scheduled cron job runs at midnight each day to close expired leagues and create new ones according to the appropriate calendar logic. Each league maintains a leaderboard sorted by profit and loss relative to each user's portfolio value at the time they joined that league. When a trade triggers a league update, the new portfolio value is broadcast via WebSocket to all clients viewing that league, and each client recalculates local rankings in real time.

Gamification is handled through an achievement engine that evaluates user behavior against a set of predefined criteria after each trade. Criteria include trade volume, diversification across distinct stock symbols, daily trade frequency, and others. When a user meets or exceeds a threshold, the achievement is unlocked, experience points are credited, and the frontend delivers a notification with a confetti animation scaled to the rarity of the achievement.

---

## Innovation and Creativity

The platform makes several deliberate architectural decisions that distinguish it from a straightforward trading simulator.

The market simulation is not a simple random number generator. It uses a deterministic sine-wave cycle to create predictable bull and bear phases that players can learn to recognize and react to, layered with stochastic noise and a price-gravity mechanism. This means the market behaves in a way that rewards observation and strategy, not just luck. Players who track the cycle and adjust their positions accordingly will genuinely outperform those who trade randomly. This is a meaningful departure from simulators that treat every price tick as an independent random event.

Real-time consistency across all connected clients is maintained without polling. The WebSocket architecture ensures that when one user executes a trade that changes a league standing, every other user viewing that leaderboard sees the update within the same tick cycle. This creates a genuinely competitive atmosphere where leaderboard positions shift visibly in real time.

The league enrollment model is intentionally frictionless. Rather than requiring users to manually join leagues, the system automatically enrolls them on their first trade and sets their starting value to their portfolio value at that moment. This design choice is fair because it means no user gains an advantage by joining early, and it eliminates a friction point that would otherwise reduce participation.

The achievement system is decoupled from the trade execution path. Achievement checks run asynchronously after a trade has already committed and returned a response to the user. This means achievements never delay or block a trade, and if the achievement check fails for any reason, it fails silently without affecting the trade itself. This separation of concerns keeps the core financial logic clean and testable while still delivering gamification.

---

## Technical Complexity and Stack

**Frontend**

The frontend is built with Next.js using the App Router and TypeScript. State management is handled by Redux Toolkit with redux-persist for selective persistence: authentication state is persisted to localStorage so sessions survive page reloads, portfolio data is persisted to sessionStorage so it survives navigation but clears on browser close, and the watchlist is persisted to localStorage. Trading state and league data are not persisted at all, ensuring they are always fetched fresh.

The Redux store contains six slices. The auth slice manages login, registration, logout, and profile fetching, all backed by JWT cookies set by the backend. The portfolio slice holds cash balance, holdings, and total value, and contains a reducer that updates individual holding prices in response to WebSocket price ticks without requiring a full portfolio refetch. The trading slice handles buy and sell order execution and trade history pagination. The stocks slice manages search results, selected stock details, price history by range, and the watchlist, and contains the live price update reducer that pushes new data points onto the one-day chart array while leaving historical chart data untouched. The leagues slice manages active leagues, the currently selected league tab, and the leaderboard, including a real-time update reducer that recalculates scores and re-sorts rankings on each WebSocket event. The achievements slice fetches and displays all achievements with progress tracking and handles unlock notifications.

WebSocket integration is handled through a custom hook architecture. A global socket instance is created once and shared across the application. The useSocket hook manages connection lifecycle tied to authentication state. The useMarketStream hook subscribes to market price updates and dispatches them to the stocks slice. The useLeagueSocket hook listens for league update events and dispatches them to the leagues slice. Each hook handles its own subscription and cleanup, preventing memory leaks.

Charts are rendered using Recharts. The stock detail page displays a live area chart that appends new price points as they arrive via WebSocket. The portfolio page includes a pie chart for asset allocation. The trade history page includes an area chart showing trading volume over time.

**Backend**

The backend is built with Express.js on Node.js. The database layer uses MongoDB via Mongoose, with Redis used as a caching layer in the authentication middleware to reduce repeated database lookups for user records on authenticated requests.

Authentication is cookie-based using JSON Web Tokens. The token is set as an httpOnly, secure, sameSite cookie on login or registration. The authenticateToken middleware extracts the token from the cookie, verifies it, and attempts to load the user from Redis first. On a cache miss, it queries MongoDB and populates the Redis cache with a five-minute expiry.

Trade execution uses MongoDB transactions to guarantee atomicity. A buy order locks the portfolio document, verifies sufficient cash balance, updates the holdings array (either incrementing an existing position or adding a new one with a weighted average price calculation), deducts the cost from cash, and creates a trade record, all within a single transaction. If any step fails, the entire transaction rolls back. The same pattern applies to sell orders.

The market simulator is a singleton class that loads all active stocks into memory on startup. It runs two interval loops: a fast loop every two seconds that calculates new prices and emits them via WebSocket, and a slow loop every sixty seconds that performs a bulk write to MongoDB to persist the accumulated price history. This two-tier approach keeps the WebSocket emissions fast and the database load manageable.

League management combines a cron job for lifecycle management with inline updates triggered by trades. The cron job runs daily at midnight, closes any leagues whose end date has passed, and creates new leagues based on the day of the week and day of the month. Trade execution triggers the updateUserLeagues helper, which finds all active leagues, either updates the user's existing entry or creates a new one via upsert, and emits a WebSocket event to the league room.

The achievement service uses a strategy pattern to route different achievement criteria types to their respective calculation methods. After each trade, the trade controller invokes the achievement service with the relevant criteria types. The service queries for all active achievements matching those types, calculates the user's current progress against each one, updates or creates the user's progress record, and unlocks any achievements where the threshold has been met.

**Key Dependencies**

| Layer | Technology | Purpose |
|---|---|---|
| Frontend Runtime | Next.js 16, React 19 | Application framework and rendering |
| Frontend State | Redux Toolkit, redux-persist | Global state management with selective persistence |
| Frontend Real-Time | Socket.io-client | WebSocket connection to backend |
| Frontend Charts | Recharts | Data visualization |
| Backend Runtime | Node.js, Express.js 5 | HTTP server and routing |
| Backend Database | MongoDB, Mongoose | Primary data store |
| Backend Cache | Redis | User record caching in auth middleware |
| Backend Real-Time | Socket.io | WebSocket server for market and league updates |
| Backend Scheduling | node-cron | Midnight league lifecycle management |
| Authentication | jsonwebtoken, bcrypt | Token generation and password hashing |
| Validation | Zod | Request body validation on backend, form validation on frontend |

---

## Usability and Impact

The target audience for TradeQuest is college and university students who have limited or no prior experience with stock markets. The platform is designed so that a user with no financial background can register, understand what they are looking at, and begin trading within minutes, while still providing enough depth that experienced users find the competitive leagues and achievement system engaging over time.

The dashboard serves as the primary entry point after login. It presents portfolio value, cash balance, active holdings count, and experience points in a single view. A leaderboard widget shows the top five players in the currently selected league, with the logged-in user highlighted if they appear in the top ranks. Recent trades and achievement progress are displayed below, giving the user an immediate sense of both their financial position and their gamification progress.

The stock marketplace allows users to search for stocks by symbol or company name. Results update in real time as the user types. Each stock card displays the current price and the percentage change since the previous close, color-coded green or red. Users can add stocks to a watchlist for quick tracking. Clicking through to a stock detail page shows a live chart that updates every two seconds, a trading panel with quantity input and total cost calculation, and buy and sell buttons. The interface validates affordability in real time and displays an insufficient funds warning before the user attempts to submit.

The portfolio page provides a detailed breakdown of all current holdings with live market prices, a pie chart showing the split between stocks and cash, and a paginated trade history table. The trade history page adds filtering by symbol and trade type, a volume chart, and CSV export functionality.

The league system gives the competitive dimension its structure. Users can switch between daily, weekly, and monthly league tabs. Each leaderboard updates in real time as trades execute. The scoring metric is straightforward: profit or loss relative to portfolio value at the time of enrollment. This means all users within a league are competing on the same basis regardless of when they joined.

Achievements provide long-term motivation beyond the leaderboard. As users trade more frequently, diversify their holdings, and engage with the platform consistently, they unlock achievements that award experience points. Progress bars on locked achievements give users a clear sense of how close they are to the next unlock. Newly unlocked achievements trigger a toast notification and a confetti animation, with the intensity of the animation scaled to the rarity of the achievement.

The real-world impact of this platform lies in its ability to lower the barrier to financial education. Students can experiment with trading strategies, observe how market conditions affect prices, and develop intuition about portfolio management without any financial risk. The competitive league structure adds accountability and motivation that passive learning tools lack. Over time, users who engage with the platform regularly will have built practical familiarity with trading mechanics that transfers to real-world investing decisions.

---

## Setup Instructions

The following instructions assume a development environment. Node.js 18 or higher and npm are required. A running MongoDB instance is required, either locally or via a cloud provider such as MongoDB Atlas. A Redis instance is required for the backend cache layer.

**Backend Setup**

```bash
cd backend
npm install
cp .env.example .env
```

Open the .env file and fill in the required values. The mandatory variables are listed below with descriptions of what each one controls.

```
NODE_ENV=development
PORT=8080
MONGODB_URI=mongodb://localhost:27017
DB_NAME=tradequest
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=<generate a long random string>
JWT_EXPIRE=7d
GEMINI_API_KEY=<your Google Gemini API key>
ELEVENLABS_API_KEY=<your ElevenLabs API key>
```

To seed the database with sample stocks, users, portfolios, trades, leagues, and league entries, run the seed script once after the database connection is confirmed:

```bash
node scripts/seedData.js
```

This script creates 20 Indian stocks based on Nifty 50 constituents, 500 synthetic users with realistic portfolios and trade histories, three active leagues (daily, weekly, monthly), and league entries for a subset of users. It clears all existing data before inserting.

Start the backend server:

```bash
node server.js
```

The server will connect to MongoDB, initialize the Redis cache, start the cron scheduler, load all active stocks into the market simulator, and begin listening on the configured port. Console output confirms each step as it completes.

**Frontend Setup**

```bash
cd frontend
npm install
```

Create a .env.local file in the frontend directory with the following variable:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

This URL must match the backend PORT value. The frontend uses this for both HTTP API calls and WebSocket connections.

Start the frontend development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000 by default.

**Verification**

Once both servers are running, navigate to http://localhost:3000. The login page will appear. Register a new account or log in with any account created by the seed script (all seeded accounts use the password Password@123). After logging in, the dashboard will load. Stock prices on the marketplace page will update every two seconds. Executing a buy or sell trade will update the portfolio, enroll the user in active leagues, and check for achievement progress.

---

## Presentation / Demo Link

Demo Link: https://trade-quest.piyushbuilds.me
Backend Health Endpoint: https://api.codesprint.piyushbuilds.me/health

## Team Members
Team Member 1: Piyush Jain
Team Member 2: Bobby Anthene Rao

Created with Love