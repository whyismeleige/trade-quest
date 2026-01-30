# TradeQuest
**Project Name:** Trade Quest

**Problem Statement ID:** CS06SF

**Team Name:** ByteMonks    

**College Name:** St Joseph's Degree and PG College, Hyderabad

---

## Problem Statement

**Theme:** Stock Market & FinTech

**Statement:** Gamified Virtual Trading League for Students

Create an engaging platform where students can learn stock trading through gamification, compete in leagues, and develop financial literacy in a risk-free environment.

---

## Proposed Solution

TradeQuest is a comprehensive virtual stock trading platform that combines real-world market dynamics with gaming elements to make financial education accessible and engaging for students. The platform features:

- **Virtual Trading Environment** with real-time market data simulation
- **League System** for competitive trading with peers
- **Gamification** through points, levels, and achievements
- **AI-Powered Insights** using Google Gemini AI for personalized trading tips
- **Real-time Updates** via WebSocket connections for live market data

---

## Innovation & Creativity

- **Dual Learning Approach**: Combines practical trading experience with gamified challenges
- **AI-Driven Mentorship**: Personalized insights and recommendations for each trader
- **Social Trading**: League-based competition fostering peer learning
- **Progressive Difficulty**: Level system that adapts challenges to user skill

---

## Technical Complexity & Stack

**Frontend:**
- Next.js 14 (TypeScript, App Router)
- TailwindCSS for styling
- Socket.io-client for real-time updates
- Recharts for data visualization
- Zod for validation

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.io for WebSockets
- JWT authentication
- Google Gemini AI integration

**Development Tools:**
- Git for version control
- npm for package management

---

## Usability & Impact

**Target Users:** College and high school students learning about finance and investing

**Impact:**
- Makes financial education accessible without monetary risk
- Builds confidence in trading and investment decisions
- Creates a supportive learning community through leagues
- Develops practical skills applicable to real-world investing

**User Interaction:**
- Intuitive dashboard showing portfolio performance
- Simple buy/sell interface
- Real-time leaderboards and rankings
- Achievement notifications for motivation

---

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Google Gemini API key

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables in .env
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Configure API URL in .env.local
npm run dev
```

### Environment Variables

**Backend (.env):**
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## Presentation / Demo Link

---

**Built for CodeSprint 2026 Hackathon**