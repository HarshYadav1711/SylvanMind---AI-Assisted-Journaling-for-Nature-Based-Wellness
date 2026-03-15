# SylvanMind

**SylvanMind** is a lightweight journaling platform for reflective writing, emotional tone analysis, and personal insights. Users write entries with a chosen ambience (forest, ocean, mountain), optionally analyze text for emotion and keywords via NLP, and view aggregated insights over their journal history.

- **Journal:** Create entries, pick an ambience, save, and analyze text on demand.
- **Insights:** See total entries, top emotion, most used ambience, and recent keywords.
- **Stack:** Node.js + MongoDB backend, Next.js frontend, HuggingFace + natural for analysis, Redis for analysis caching.

---

## Tech stack

| Layer      | Technologies |
|-----------|--------------|
| Backend   | Node.js, Express, TypeScript, MongoDB (Mongoose), Redis |
| Frontend  | Next.js 14 (App Router), React, TypeScript, Tailwind CSS |
| NLP       | HuggingFace Inference API (emotion, summarization), natural (TF-IDF keywords) |
| Cache     | Redis (analysis results keyed by SHA256 of text) |

---

## Installation

### Prerequisites

- **Node.js** 18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)
- **Redis** (optional; analysis cache is disabled if unavailable)

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd "SylvanMind — AI-Assisted Journaling for Nature-Based Wellness"
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

- `PORT` — Server port (default `3001`).
- `MONGODB_URI` — MongoDB connection string (e.g. `mongodb://localhost:27017/sylvanmind`).
- `HUGGINGFACE_API_KEY` — Required for emotion and summarization ([create a token](https://huggingface.co/settings/tokens)).
- `REDIS_URL` — Optional; e.g. `redis://localhost:6379` for analysis caching.

```bash
npm run dev
```

Backend runs at `http://localhost:3001`.

### 3. Seed the database (development)

```bash
cd backend
npm run seed
```

This creates two users and three sample journal entries. Use one of the user `_id` values for the frontend (see step 5).

### 4. Frontend setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Edit `.env.local`:

- `NEXT_PUBLIC_API_URL` — Backend URL (e.g. `http://localhost:3001`).
- `NEXT_PUBLIC_DEFAULT_USER_ID` — Optional; paste a user `_id` from the seed so the app loads with a user pre-filled.

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`.

### 5. Set user ID (if not in env)

If you did not set `NEXT_PUBLIC_DEFAULT_USER_ID`, open the **Journal** page and enter a user `_id` from the seeded data. It is stored in localStorage and used for journal and insights.

---

## Run with Docker

With Docker and Docker Compose installed, you can run the full stack locally:

```bash
docker compose up --build
```

- **MongoDB** — `localhost:27017` (data in volume `mongodb_data`)
- **Redis** — `localhost:6379`
- **Backend** — `http://localhost:3001`
- **Frontend** — `http://localhost:3000`

The frontend is built with `NEXT_PUBLIC_API_URL=http://localhost:3001` so the browser can call the API. To pass a HuggingFace API key for analysis, set it in the environment before starting:

```bash
export HUGGINGFACE_API_KEY=your_token
docker compose up --build
```

To seed the database after the stack is up (backend container inherits `MONGODB_URI` from Compose):

```bash
docker compose run --rm backend node dist/scripts/seed.js
```

Then use a user `_id` from the seeded data in the frontend (Journal page or `NEXT_PUBLIC_DEFAULT_USER_ID`).

---

## API endpoints

All API routes are prefixed with `/api`. Success responses that return a single resource or list use a `data` wrapper; analysis returns a flat object.

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/api/health` | Health check. Returns `{ "status": "ok" }`. |
| `POST` | `/api/journal` | Create a journal entry. Body: `{ userId, text, ambience }`. Returns `{ data: <entry> }`. |
| `GET`  | `/api/journal/:userId` | List journal entries for `userId`, newest first. Returns `{ data: <entries[]> }`. |
| `POST` | `/api/journal/analyze` | Analyze journal text. Body: `{ text }`. Returns `{ emotion, keywords, summary }`. Uses Redis cache when available (key: SHA256 of text). |
| `GET`  | `/api/journal/insights/:userId` | Aggregated insights for `userId`. Returns `{ data: { totalEntries, topEmotion, mostUsedAmbience, recentKeywords } }`. |

**Validation**

- Create entry: `text` non-empty; `ambience` one of `forest`, `ocean`, `mountain`; `userId` required.
- Analyze: `text` required and non-empty.
- Insights and list: `userId` must be a valid MongoDB ObjectId.

---

## Screenshots

Screenshot placeholders. Add images under `docs/screenshots/` and reference them below.

- **Home** — Landing with hero and links to Journal and Insights.  
  `docs/screenshots/home.png`
- **Journal** — Editor (textarea, ambience selector, Save / Analyze) and recent entries list.  
  `docs/screenshots/journal.png`
- **Insights** — Panel with total entries, top emotion, most used ambience, recent keywords.  
  `docs/screenshots/insights.png`

Example: `![Home](docs/screenshots/home.png)`

---

## Cost

The project is built to run on free tiers where possible: HuggingFace Inference API (rate-limited), MongoDB Atlas M0, Redis (e.g. free tier or local). No credit card is required for development.
