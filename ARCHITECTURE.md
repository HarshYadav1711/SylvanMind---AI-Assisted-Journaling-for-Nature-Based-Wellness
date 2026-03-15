# Architecture

To be documented.

The application follows a clean architecture: backend uses **routes → controllers → services → models**, with shared **utils**. The frontend uses Next.js App Router and a central API client in `lib/api.ts` for backend communication.
