# SilentLoad AI — Full Stack App

A mental load manager app built with React + Vite + Tailwind (frontend) and Express + JSON database (backend).

---

## 📁 Project Structure

```
silentload-app/
├── frontend/          ← React + Vite + Tailwind app
│   └── src/
│       ├── api.js     ← All backend API calls
│       ├── routes.jsx ← Protected routes
│       └── Screens/   ← All screens (auth wired up)
└── backend/           ← Express API server
    ├── server.js      ← All routes (auth, tasks, checkins, mood)
    ├── .env           ← Environment config
    └── db.json        ← Auto-created JSON database (gitignore this)
```

---

## 🚀 How to Run (Step by Step)

### Prerequisites
- Node.js 18+ installed
- npm installed

---

### Step 1 — Start the Backend

```bash
cd backend
npm install
npm start
```

You should see:
```
✅ SilentLoad backend running → http://localhost:5000
```

> For auto-restart on file changes during development:
> ```bash
> npm run dev
> ```

---

### Step 2 — Start the Frontend

Open a **new terminal window**, then:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
  VITE ready in Xs
  ➜  Local: http://localhost:5173/
```

Open **http://localhost:5173** in your browser. 🎉

---

## 🔐 How Auth Works

1. User visits `/` → Splash screen (2.8 sec) → redirects to `/auth`
2. User registers or logs in → JWT token stored in `localStorage`
3. All dashboard/task routes are **protected** — redirect to `/auth` if not logged in
4. Logout button (top right of dashboard) clears session

---

## 📡 API Endpoints

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, get JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/tasks` | ✅ | Today's tasks |
| GET | `/api/tasks/all` | ✅ | All tasks |
| POST | `/api/tasks` | ✅ | Add task |
| PATCH | `/api/tasks/:id/complete` | ✅ | Toggle complete |
| DELETE | `/api/tasks/:id` | ✅ | Delete task |
| POST | `/api/checkins` | ✅ | Save morning check-in |
| GET | `/api/checkins/today` | ✅ | Get today's check-in |
| POST | `/api/mood` | ✅ | Log end-of-day mood |
| GET | `/api/mood` | ✅ | Mood history (last 30) |
| GET | `/api/stats` | ✅ | Dashboard stats |

---

## 🗄️ Database

- Uses **lowdb** — a simple JSON file database (`backend/db.json`)
- No setup needed — file is auto-created on first run
- Data persists between server restarts
- **Add `db.json` to `.gitignore`** before pushing to GitHub

---

## ⚙️ Environment Variables

`backend/.env`:
```
PORT=5000
JWT_SECRET=silentload_super_secret_key_change_in_production_2024
```

> **Important:** Change `JWT_SECRET` to a strong random string before deploying to production.

---

## 🌐 Production Deployment

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
# Upload the dist/ folder
```
Update `api.js` BASE URL from `/api` to your backend URL.

### Backend (Railway / Render / any Node host)
```bash
cd backend
npm start
```
Set environment variables on your host platform.

---

## ✨ What's Wired Up

| Feature | Status |
|---------|--------|
| Register account | ✅ Functional |
| Login | ✅ Functional |
| Logout | ✅ Functional |
| Protected routes | ✅ Functional |
| Add tasks | ✅ Saved to DB |
| View today's tasks | ✅ From DB |
| Mark task complete | ✅ Persisted |
| Delete task | ✅ Persisted |
| Morning check-in | ✅ Saves to DB, adjusts capacity |
| End-of-day mood log | ✅ Saved to DB |
| Dashboard stats | ✅ Live from DB |
| Per-user data isolation | ✅ JWT-based |
