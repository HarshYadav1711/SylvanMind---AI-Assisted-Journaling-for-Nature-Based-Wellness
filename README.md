# SylvanMind

SylvanMind is an AI-assisted journaling app for reflective writing and nature-based wellness. It helps users capture thoughts in a calm, ambient context and understand patterns in their writing through emotion analysis, keyword extraction, and summarization—without locking them into a single vendor or heavy infrastructure.

---

## Features

- **Journal entries** — Write entries with an optional ambience (forest, ocean, mountain). Entries are stored per user and listed newest first.
- **Emotion analysis** — On-demand analysis of journal text for emotional tone (e.g. joy, sadness, anger, neutral) via HuggingFace.
- **Keyword extraction** — TF-IDF–based keyword extraction from the same text, run locally with no external API.
- **Journaling insights** — Aggregated view of a user’s journal: total entries, most frequent emotion, most used ambience, and recent keywords.

---

## How It Works

1. **Write** — User submits journal text (and ambience) via the frontend; the backend stores it in MongoDB.
2. **Analyze** — When the user clicks “Analyze,” the backend:
   - Optionally checks Redis for a cached result (key = SHA256 of trimmed text).
   - On cache miss: calls HuggingFace for emotion and summarization, runs keyword extraction with `natural`, merges the result, and caches it for 24 hours.
   - Returns `{ emotion, keywords, summary }` to the client.
3. **Insights** — The insights endpoint aggregates stored entries by user (counts, top emotion, top ambience, recent keywords from stored analysis).

---

## Tech Stack

| Layer    | Technologies |
|----------|--------------|
| Backend  | Node.js, Express, TypeScript, MongoDB (Mongoose), Redis |
| Frontend | Next.js 14 (App Router), React, TypeScript, Tailwind CSS |
| NLP      | HuggingFace Inference API (emotion, summarization), natural (TF-IDF keywords) |
| Cache    | Redis (analysis results keyed by SHA256 of text; optional) |

---

## Project Structure

```
├── backend/
│   └── src/
│       ├── controllers/   # Request handlers (journal, analyze, insights)
│       ├── middleware/    # Error handling, etc.
│       ├── models/        # Mongoose schemas (User, JournalEntry)
│       ├── routes/        # API route definitions
│       ├── services/      # Business logic (journal, analysis, insights, HuggingFace)
│       ├── utils/         # Validation, cache, env, errors
│       ├── scripts/       # Seed script for development
│       ├── app.ts         # Express app setup
│       └── index.ts       # Server entry
├── frontend/
│   ├── app/               # Next.js App Router (pages, layout)
│   ├── components/        # Reusable UI components
│   ├── lib/               # API client, hooks (e.g. useUserId)
│   └── public/
├── ARCHITECTURE.md        # Scaling, caching, privacy notes
└── README.md
```

---

## API Endpoints

Base URL: `/api`. All JSON. Success responses that return a resource or list use a `data` wrapper; analysis returns a flat object.

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/api/health` | Health check. |
| `POST` | `/api/journal` | Create a journal entry. |
| `GET`  | `/api/journal/:userId` | List entries for `userId`, newest first. |
| `POST` | `/api/journal/analyze` | Analyze journal text (emotion, keywords, summary). Cached when Redis is available. |
| `GET`  | `/api/journal/insights/:userId` | Aggregated insights for `userId`. |

**Validation:** Create entry requires non-empty `text`, `ambience` in `forest` | `ocean` | `mountain`, and `userId`. Analyze requires non-empty `text`. List and insights require `userId` as a valid 24-char hex MongoDB ObjectId.

### Example: Create entry

```http
POST /api/journal
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "text": "Today I felt calm walking by the trees.",
  "ambience": "forest"
}
```

```json
{
  "data": {
    "_id": "...",
    "userId": "507f1f77bcf86cd799439011",
    "text": "Today I felt calm walking by the trees.",
    "ambience": "forest",
    "createdAt": "2025-03-15T12:00:00.000Z"
  }
}
```

### Example: Analyze text

```http
POST /api/journal/analyze
Content-Type: application/json

{
  "text": "Today I felt calm walking by the trees."
}
```

```json
{
  "emotion": "neutral",
  "keywords": ["calm", "trees", "walking", "today"],
  "summary": "The author felt calm while walking near trees."
}
```

### Example: Get insights

```http
GET /api/journal/insights/507f1f77bcf86cd799439011
```

```json
{
  "data": {
    "totalEntries": 12,
    "topEmotion": "joy",
    "mostUsedAmbience": "forest",
    "recentKeywords": ["calm", "trees", "walking", "today", "morning"]
  }
}
```

---

## Setup

### Prerequisites

- **Node.js** 18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)
- **Redis** (optional; analysis cache is disabled if unavailable)

### 1. Clone and install

```bash
git clone <repository-url>
cd "SylvanMind — AI-Assisted Journaling for Nature-Based Wellness"
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`: set `PORT` (default `3001`), `MONGODB_URI`, `HUGGINGFACE_API_KEY` ([create a token](https://huggingface.co/settings/tokens)), and optionally `REDIS_URL` (e.g. `redis://localhost:6379`).

```bash
npm run dev
```

Backend: `http://localhost:3001`.

### 3. Seed (development)

```bash
cd backend
npm run seed
```

Creates two users and sample entries. Use one of the user `_id` values in the frontend.

### 4. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Edit `.env.local`: set `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:3001`) and optionally `NEXT_PUBLIC_DEFAULT_USER_ID` (a seeded user `_id`).

```bash
npm run dev
```

Frontend: `http://localhost:3000`. If no default user ID is set, open the Journal page and enter a seeded user `_id`; it is stored in localStorage.

### 5. Docker (optional)

```bash
docker compose up --build
```

MongoDB and Redis run in containers; backend and frontend are built and served. To pass a HuggingFace key: `HUGGINGFACE_API_KEY=your_token docker compose up --build`. Seed after startup:

```bash
docker compose run --rm backend node dist/scripts/seed.js
```

---

## Future Improvements

- **Authentication** — Replace client-supplied `userId` with server-verified identity (e.g. OAuth or JWT) so journal data is properly isolated and secure.
- **Rate limiting** — Throttle analysis and write endpoints per user or IP to protect HuggingFace usage and backend stability.
- **Export** — Allow users to export their journal (e.g. JSON or Markdown) for backup or portability.
- **PWA / offline** — Optional offline draft storage and sync when back online to improve use on the go.

---

## Cost

Designed to run on free tiers where possible: HuggingFace Inference (rate-limited), MongoDB Atlas M0, Redis (local or free tier). No credit card required for development.
