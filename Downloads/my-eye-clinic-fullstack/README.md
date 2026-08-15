# EyeCare Clinic — Full Stack Website

A full-featured eye clinic website: public marketing site with doctor profiles, services,
a small shop, appointment booking, and a **password-protected admin panel** for managing
everything, backed by a real API (no more data that disappears on refresh).

## What's included

**Public site**
- Hero, services, doctors, shop with cart & checkout, testimonials, appointment booking
  (with live time-slot availability and PDF/print confirmation), contact/newsletter form
- Real backend persistence — appointments, orders, and messages are saved to disk, not just React state

**Admin panel** (`/admin`)
- Secure login (JWT-based, bcrypt-hashed password)
- Dashboard overview with key stats
- Appointments: view, confirm, cancel, delete
- Manage doctors, services, and shop products (add / edit / delete)
- View contact & newsletter messages
- Change admin password

## Project structure

```
my-eye-clinic/
├── src/                     # React frontend (Vite)
│   ├── api/client.js        # API wrapper for all backend calls
│   ├── context/AuthContext.jsx
│   ├── components/ProtectedRoute.jsx
│   ├── pages/AdminLogin.jsx
│   ├── pages/AdminDashboard.jsx
│   └── assets/eyecomponents/Landing.jsx   # main public site
└── server/                  # Node/Express backend
    ├── index.js             # API routes
    ├── db.js                # lowdb (JSON file) data layer + seed data
    ├── middleware/auth.js   # JWT auth middleware
    └── data.json            # created automatically on first run (gitignore this!)
```

## Getting started

### 1. Install dependencies (frontend + backend)

```bash
npm run setup
```

### 2. Configure the backend

```bash
cd server
cp .env.example .env
```

Open `server/.env` and set a long, random `JWT_SECRET` before deploying anywhere real.

### 3. Run everything

From the project root:

```bash
npm run dev:all
```

This starts the API on `http://localhost:4000` and the frontend on `http://localhost:5173`
(or similar — Vite will tell you) at the same time.

Or run them separately in two terminals:

```bash
npm run server   # backend only
npm run dev      # frontend only
```

### 4. Log into the admin panel

Visit `http://localhost:5173/admin/login`

- **Username:** `admin`
- **Password:** `eyecare123`

**Change this password immediately** via Settings inside the admin panel (or by editing
`server/db.js` before first run) — do not deploy with the default credentials.

## Deploying

- **Frontend**: `npm run build` produces a static `dist/` folder — deploy to Vercel, Netlify,
  GitHub Pages, or any static host.
- **Backend**: deploy the `server/` folder to any Node host (Render, Railway, Fly.io, a VPS, etc).
  Set the `JWT_SECRET` and `PORT` environment variables there.
- Set `VITE_API_URL` (e.g. in a `.env` file at the project root, or as a build-time env var)
  to your deployed backend's URL, e.g. `https://your-api.example.com/api`, before building
  the frontend for production. Locally it defaults to `http://localhost:4000/api`.
- The backend currently stores data in a local JSON file (`server/data.json`) via lowdb —
  this is fine for a small clinic getting started, but for real production traffic you'll
  eventually want to swap it for a proper database (Postgres, MongoDB, etc). The API layer
  in `server/index.js` is written so that swap only touches `server/db.js`.

## Notes

- CORS is open by default in `server/index.js` — lock `cors()` down to your real frontend
  domain before going live.
- The admin JWT is stored in `localStorage` — fine for this scale, but if you need
  stronger session security later, consider httpOnly cookies instead.
