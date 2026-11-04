# FinTrack – Personal Finance Tracker

A full-stack MERN web app to record income and expenses, view spending charts, and track your balance. Secured with JWT authentication.

**Live demo:** https://finance-tracker-mauve-delta.vercel.app/

## Features
- Register and login with JWT, passwords hashed with bcrypt
- Show/hide password, name validation (letters only, max 10)
- Protected routes on frontend and backend
- Add and delete income and expense transactions
- Pie chart (spending by category) and bar chart (monthly trends)
- Income, expense and balance summary cards
- Profile card on the dashboard
- Filter by type, category and date range
- Export transactions as CSV
- Responsive layout, light and dark mode
- Toast messages, form validation, loading states

## Tech stack
React, Vite, Tailwind CSS, Context API, Recharts, Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

## Project structure
```
finance-tracker/
├── client/   # React app
└── server/   # Express API
```

## Run locally
Requires Node.js 18+.

```bash
# Backend
cd server
copy .env.example .env     # Mac/Linux: cp .env.example .env
npm install
npm start                  # http://localhost:5000

# Frontend (new terminal)
cd client
npm install
npm run dev                # http://localhost:5173
```

In `server/.env`, set `MONGO_URI` to a MongoDB Atlas connection string, or set `USE_LOCAL_DB=true` to run a local database without Atlas.

## API
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET | /api/transactions | List transactions (filters supported) |
| POST | /api/transactions | Add transaction |
| DELETE | /api/transactions/:id | Delete transaction |
| GET | /api/transactions/summary | Totals and chart data |
| GET | /api/transactions/export | Download CSV |

## Deployment
Frontend on Vercel, backend on Render, database on MongoDB Atlas. Secrets are stored in environment variables, never in the repo.