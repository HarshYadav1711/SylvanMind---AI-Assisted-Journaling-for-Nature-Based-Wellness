# Architecture

SylvanMind uses a clean, layered backend (routes → controllers → services → models) and a Next.js frontend that talks to the API. This document covers scaling, LLM cost control, caching, and data privacy.

---

## Scaling to 100k users

- **Stateless API** — The backend holds no session state. Any instance can serve any request. Run multiple Node processes behind a load balancer (e.g. multiple containers or PM2 cluster) and scale horizontally.
- **MongoDB** — Use a replica set for read scaling. Add read replicas and direct read-heavy workloads (e.g. journal list, insights) to secondaries. Sharding is an option if a single cluster becomes the bottleneck; shard key can be `userId` so a user’s data stays on one shard.
- **Redis** — Use a managed Redis cluster (or Redis Cluster) for the analysis cache. A single instance is fine for moderate traffic; at higher scale, cluster for capacity and high availability.
- **Frontend** — Serve the Next.js app from a CDN (e.g. Vercel, Cloudflare Pages). Static assets and cached pages reduce load on the origin.
- **Rate limiting and timeouts** — Add rate limiting (e.g. per IP or per `userId` once auth exists) and enforce timeouts on external calls (HuggingFace, Redis) so one slow or abusive client doesn’t tie up workers.

---

## Reducing LLM costs

- **Redis cache** — Identical journal text reuses the same analysis. Cache key is SHA256 of the trimmed input; TTL is 24 hours. Duplicate or repeated entries avoid HuggingFace calls entirely.
- **Keyword extraction only** — Keywords use the local `natural` (TF-IDF) library, not the LLM. Only emotion and summary hit HuggingFace. For a “keywords only” mode, you can skip the API and cut cost further.
- **Model and provider choice** — The app uses HuggingFace Inference (emotion + summarization). You can swap to smaller or cheaper models, or different providers, in the analysis service without changing the rest of the stack.
- **Rate and quota** — Throttle analysis (e.g. per user or per IP) and consider a cap per user per day so usage stays predictable and costs controlled.

---

## How caching works

- **When** — Caching applies only to **journal analysis** (emotion, keywords, summary). Creating or listing entries is not cached.
- **Key** — `sylvanmind:analysis:` + SHA256(trimmed journal text). Same text always maps to the same key; different text gets a different key.
- **Flow** — On `POST /api/journal/analyze`:
  1. Compute the cache key from the request body `text`.
  2. Try to get the result from Redis (`GET key`).
  3. On **hit**: return the stored `{ emotion, keywords, summary }` and stop.
  4. On **miss**: call HuggingFace (emotion, summary) and natural (keywords), merge into one result, then `SETEX key 86400 <json>` (24 h TTL) and return the result.
- **Resilience** — If Redis is down or `REDIS_URL` is unset, the backend skips cache and still runs analysis; no cache is written or read.

---

## User data and privacy

- **No authentication in scope** — The current app does not implement login or sessions. The frontend sends a `userId` (e.g. from env or localStorage); the API trusts it. For production, add authentication and derive `userId` from the authenticated identity so users cannot access others’ data.
- **Isolation** — All journal and insights APIs are scoped by `userId`. Queries and aggregations filter on `userId`; there is no cross-user data exposure in the current design. Enforcing a verified `userId` (via auth) is required for real privacy.
- **Journal content** — Entry text is sensitive. It is stored in MongoDB and may be sent to HuggingFace for analysis. Ensure:
  - **TLS** for all client–server and server–external API traffic.
  - **Encryption at rest** for MongoDB (and Redis if it holds cached analysis).
  - **Data handling** consistent with your policy: e.g. minimal retention, no use of journal text for model training unless users consent.
- **Cache and PII** — Cached analysis is keyed by SHA256 of the text; the key does not reveal the content. The cached value is the analysis result (emotion, keywords, summary), not the raw journal text. Redis should be treated as part of your secure backend (network isolation, access control).
- **Recommendations** — Add authentication and authorization; never trust `userId` from the client without verification. Optionally encrypt journal fields at the application layer for an extra layer of protection. Document data flows and retention in a privacy policy.
