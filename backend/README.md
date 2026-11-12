# Anum's Portfolio Backend API 🚀

Production-grade RESTful API built for **Anum**, a Computer Science student, powering their portfolio website and the pixel-art mascot companion **Numi**.

---

## 🛠️ Tech Stack

- **Runtime & Language:** Node.js (v20+) + TypeScript (strict mode, ES Modules)
- **Framework:** Express.js
- **Database & ORM:** PostgreSQL (Neon / Supabase) with Prisma ORM
- **Validation:** Zod schemas
- **Security:** Helmet, CORS (origin restricted), Cookie-parser, Bcrypt, JWT (httpOnly cookie & Bearer token), Express-rate-limit
- **Email:** Resend API (with automatic graceful fallback)
- **Logging:** Pino & Pino-HTTP structured JSON logging
- **Documentation:** OpenAPI 3.0 & Swagger UI (`/api/docs`)
- **Testing:** Vitest + Supertest (22 integration tests passing)
- **Deployment:** Render, Railway, Docker multi-stage container

---

## 📁 Project Architecture

```
backend/
├── assets/
│   └── cv.pdf                       # PDF resume served by /api/cv
├── prisma/
│   ├── schema.prisma                # PostgreSQL schema & indexes
│   └── seed.ts                      # Seeds placeholder data (TODOs marked)
├── src/
│   ├── app.ts                       # Express application configuration
│   ├── server.ts                    # HTTP server listener & graceful shutdown
│   ├── config/
│   │   └── env.ts                   # Strongly-typed Zod environment validator
│   ├── controllers/
│   │   ├── admin.controller.ts      # Admin auth, content CRUD, moderation, analytics
│   │   ├── contact.controller.ts    # Contact form with honeypot & email trigger
│   │   ├── content.controller.ts    # Public projects, skills, achievements, experiments
│   │   ├── currently.controller.ts  # "Currently" widget with music sync
│   │   ├── cv.controller.ts         # CV download with auto-event tracking
│   │   ├── events.controller.ts     # Privacy-friendly event tracking
│   │   ├── guestbook.controller.ts  # Public guestbook & submission moderation
│   │   ├── health.controller.ts     # Uptime & DB connectivity checks
│   │   └── numi.controller.ts       # Numi mascot witty dialogue lines
│   ├── middleware/
│   │   ├── auth.middleware.ts       # JWT admin guard (httpOnly cookie & Bearer)
│   │   ├── error.middleware.ts      # Centralized error handler ({ error: { code, message } })
│   │   ├── logging.middleware.ts    # Pino HTTP request logging
│   │   ├── rateLimiter.middleware.ts# Strict rate limits (contact, auth, guestbook)
│   │   └── validate.middleware.ts   # Zod body & query validators
│   ├── routes/
│   │   ├── index.ts                 # Master router mounted at /api
│   │   └── *.routes.ts              # Route modules
│   ├── services/
│   │   ├── auth.service.ts          # Password hashing (Bcrypt) & JWT
│   │   ├── cache.service.ts         # In-memory TTL cache with admin invalidation
│   │   ├── email.service.ts         # Resend email dispatcher
│   │   ├── filter.service.ts        # Profanity & spam moderation engine
│   │   ├── music.service.ts         # Spotify / Last.fm real-time sync with fallback
│   │   └── prisma.service.ts        # Prisma client singleton
│   ├── validators/                  # Zod input schemas
│   └── docs/
│       ├── openapi.ts               # OpenAPI 3.0 specification object
│       └── swagger.ts               # Swagger UI setup mounted at /api/docs
├── tests/                           # Vitest integration test suite
├── Dockerfile                       # Multi-stage production container
├── docker-compose.yml
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file in `backend/` by copying `.env.example`:

```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | HTTP server port | `5000` |
| `NODE_ENV` | Environment (`development`, `production`, `test`) | `development` |
| `FRONTEND_URL` | Allowed origin for CORS & cookies | `http://localhost:5173` |
| `DATABASE_URL` | Neon / Supabase PostgreSQL connection string | `postgresql://...` |
| `ADMIN_EMAIL` | Email for portfolio administrator login | `anum@example.com` |
| `ADMIN_PASSWORD` | Administrator initial password | `AdminSecure2026!` |
| `JWT_SECRET` | Secret key for JWT signing (min 16 chars) | `your_secret_key` |
| `JWT_EXPIRES_IN` | Token duration | `7d` |
| `RESEND_API_KEY` | Resend API key for contact notifications (optional) | `re_...` |
| `CONTACT_NOTIFICATION_EMAIL` | Where contact inquiries are delivered | `anum@example.com` |
| `FROM_EMAIL` | Verified sender email for Resend | `portfolio@anum.dev` |
| `LASTFM_API_KEY` | (Optional) Last.fm API key for live music track | `...` |
| `LASTFM_USERNAME` | (Optional) Last.fm username | `anum` |
| `SPOTIFY_CLIENT_ID` | (Optional) Spotify Developer Client ID | `...` |
| `SPOTIFY_CLIENT_SECRET` | (Optional) Spotify Developer Client Secret | `...` |
| `SPOTIFY_REFRESH_TOKEN`| (Optional) Spotify Refresh Token | `...` |

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v20 or v22+)
- PostgreSQL database (Neon or Supabase)

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Synchronize Database & Generate Prisma Client
```bash
npx prisma db push
```

### 4. Seed the Database
Populates initial projects, skills, achievements, experiments, Numi mascot lines, and the admin account:
```bash
npm run seed
```

### 5. Start the Development Server
```bash
npm run dev
```
The server will boot at `http://localhost:5000`.
Explore the interactive Swagger UI at **`http://localhost:5000/api/docs`**.

### 6. Run the Test Suite
```bash
npm run test
```

---

## 🚢 Deployment Guide

### Option 1: Render
1. Create a **New Web Service** and link your Git repository.
2. Set Root Directory to `backend`.
3. Set **Build Command**: `npm install && npx prisma generate && npm run build`
4. Set **Start Command**: `npx prisma db push && npm run seed && npm start`
5. Under **Environment Variables**, add the variables from `.env.example`.

### Option 2: Railway
1. Click **New Project** -> **Deploy from GitHub Repo**.
2. Set the root directory to `backend`.
3. Railway automatically detects `Dockerfile` or Node environment.
4. Add all environment variables under the **Variables** tab.

### Option 3: Docker
```bash
# Build and run with Docker Compose
docker compose up -d --build
```

---

## 📡 Complete API Reference & Curl Examples

### 1. System & Health
#### Uptime & DB Check
```bash
curl -X GET http://localhost:5000/api/health
```
**Response (200 OK):**
```json
{
  "status": "ok",
  "service": "anum-portfolio-backend",
  "timestamp": "2026-11-12T00:20:00.000Z",
  "uptimeSeconds": 42,
  "database": "connected"
}
```

---

### 2. Content Endpoints (Cached, Public)

#### Projects
```bash
curl -X GET http://localhost:5000/api/projects
```

#### Skills
```bash
curl -X GET http://localhost:5000/api/skills
```

#### Achievements
```bash
curl -X GET http://localhost:5000/api/achievements
```

#### Experiments
```bash
curl -X GET http://localhost:5000/api/experiments
```

#### "Currently" Widget Status
```bash
curl -X GET http://localhost:5000/api/currently
```
**Response (200 OK):**
```json
{
  "learning": "Distributed consensus algorithms & database storage engine internals",
  "building": "Portfolio backend API & Numi pixel mascot interactive dialogue state machine",
  "listeningTo": "Synthwave & Lo-Fi Coding Beats",
  "isLiveMusic": false,
  "updatedAt": "2026-11-12T00:12:00.000Z"
}
```

---

### 3. Numi Pixel Mascot Dialogue

#### Random Line for Section
```bash
# Section can be: hero, about, projects, skills, contact, guestbook
curl -X GET "http://localhost:5000/api/numi/lines?section=hero"
```
**Response (200 OK):**
```json
{
  "id": "cm3e...",
  "section": "hero",
  "line": "Hi there! I'm Numi, Anum's pixel companion. Watch your step, bugs might bite!"
}
```

---

### 4. Contact Form (with Honeypot & Rate Limit)

#### Submit Genuine Inquiry
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Connor",
    "email": "sarah@example.com",
    "message": "Hi Anum, loved your distributed systems projects!",
    "website": ""
  }'
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": "cm3e...",
    "createdAt": "2026-11-12T00:25:00.000Z"
  }
}
```

#### Honeypot Bot Submission (Discarded Silently)
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bot",
    "email": "bot@spam.com",
    "message": "Spam message",
    "website": "http://spamsite.com"
  }'
```
**Response (200 OK — Fake success, discarded without DB save or email):**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

---

### 5. Guestbook (Moderated & Filtered)

#### View Approved Entries
```bash
curl -X GET http://localhost:5000/api/guestbook
```

#### Submit New Note (Held as Pending)
```bash
curl -X POST http://localhost:5000/api/guestbook \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alan Turing",
    "message": "Fascinating work on the backend and mascot interaction."
  }'
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "Thank you for signing the guestbook! Your note is pending moderation by Anum.",
  "data": {
    "id": "cm3e...",
    "name": "Alan Turing",
    "message": "Fascinating work on the backend and mascot interaction.",
    "status": "pending",
    "createdAt": "2026-11-12T00:25:00.000Z"
  }
}
```

---

### 6. Privacy Analytics & CV Download

#### Log Event (No cookies, no IPs)
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "page_view",
    "path": "/projects"
  }'
```

#### Download CV (Serves PDF & auto-logs `cv_download` event)
```bash
curl -X GET http://localhost:5000/api/cv -o Anum_Resume.pdf
```

---

### 7. Admin Authentication & API (`/api/admin/*`)

#### Admin Login (Sets httpOnly cookie & returns JWT)
```bash
curl -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "anum@example.com",
    "password": "AdminSecure2026!"
  }'
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOi...",
  "admin": {
    "id": "cm3e...",
    "email": "anum@example.com"
  }
}
```

> **Note:** For all subsequent admin calls, pass `-H "Authorization: Bearer <TOKEN>"` or include the `admin_token` cookie.

#### Check Current Admin
```bash
curl -X GET http://localhost:5000/api/admin/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

#### Admin Logout
```bash
curl -X POST http://localhost:5000/api/admin/auth/logout
```

#### View Analytics Statistics
```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer <TOKEN>"
```
**Response (200 OK):**
```json
{
  "totals": {
    "pageViews": 45,
    "easterEggsFound": 12,
    "cvDownloads": 8,
    "totalEvents": 65
  },
  "dailyEvents": [
    { "date": "2026-11-12", "type": "page_view", "count": 15 }
  ],
  "topPaths": [
    { "path": "/projects", "count": 22 }
  ]
}
```

#### View Contact Messages
```bash
curl -X GET http://localhost:5000/api/admin/contacts \
  -H "Authorization: Bearer <TOKEN>"
```

#### Moderate Guestbook (Approve Entry)
```bash
curl -X PATCH http://localhost:5000/api/admin/guestbook/<ENTRY_ID>/status \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved"
  }'
```

#### Delete Guestbook Entry
```bash
curl -X DELETE http://localhost:5000/api/admin/guestbook/<ENTRY_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

#### Create New Project
```bash
curl -X POST http://localhost:5000/api/admin/projects \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Distributed Consensus Engine",
    "slug": "distributed-consensus",
    "summary": "Raft protocol implementation in Go",
    "description": "Full leader election, log replication, and persistence engine.",
    "techStack": ["Go", "gRPC", "Protobuf"],
    "liveUrl": null,
    "githubUrl": "https://github.com/anum/consensus",
    "imageUrl": "https://example.com/image.png",
    "featured": true,
    "order": 1
  }'
```

#### Update "Currently" Status
```bash
curl -X PUT http://localhost:5000/api/admin/currently \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "learning": "Rust async runtimes (Tokio)",
    "building": "Next-gen portfolio UI",
    "listeningTo": "Tycho - Awake"
  }'
```

#### Add Numi Mascot Speech Line
```bash
curl -X POST http://localhost:5000/api/admin/numi/lines \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "section": "contact",
    "line": "Did you know? Sending a nice message gives Numi +10 happiness!"
  }'
```
