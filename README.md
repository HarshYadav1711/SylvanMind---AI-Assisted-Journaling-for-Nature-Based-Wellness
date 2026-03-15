# SylvanMind

A lightweight journaling platform where users can write journal entries, analyze emotional tone using an NLP model, and view personal insights.

## Tech stack

- **Backend:** Node.js, Express, TypeScript, MongoDB
- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **NLP:** HuggingFace inference API with fallback keyword extraction via the `natural` npm package

## Features (goals)

1. Create journal entry
2. View user journal entries
3. Analyze journal text (emotion, keywords, summary)
4. View insights (top emotion, most used ambience, recent keywords)

This repository is a **scaffold only**—structure and stubs are in place; feature implementation is left for later.

## Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)

## Getting started

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MONGODB_URI and optional HUGGINGFACE_API_KEY
npm run dev
```

Backend runs at `http://localhost:3001` by default.

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL to your backend URL (e.g. http://localhost:3001)
npm run dev
```

Frontend runs at `http://localhost:3000` by default.

## Cost

All tools used are free and do not require billing or credit cards (HuggingFace free inference tier, MongoDB Atlas free tier, natural package).
