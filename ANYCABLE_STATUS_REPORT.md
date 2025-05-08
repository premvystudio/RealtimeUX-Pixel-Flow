# AnyCable 7-Step Integration – Status Report

_Date: 2025-05-08_

---

## 1  Implemented Components

| Area | File / Resource | Status |
|------|-----------------|--------|
| Environment skeleton | `.env.example` | ✅ all keys listed |
| Client Cable singleton | `src/lib/anycable.ts` | ✅ JWT, ping, monitor |
| React subscription hook | `src/hooks/useChannel.ts` | ✅ connection state + callback |
| Dev documentation | `ANYCABLE_INTEGRATION_GUIDE.md` | ✅ quick-start guide |
| NPM dependency list | (guide step) | ✅ recorded – run `pnpm i` |

> Result: **Browser → AnyCable client path is ready**; needs a live AnyCable-Go server to connect to.

---

## 2  Outstanding Items (per 7-step plan)

| Step | Description | To-Do |
|------|-------------|-------|
| 0 | Populate real environment variables | Copy `.env.example` → `.env.local` & Vercel dashboard |
| 1 | Install & commit dependencies | `pnpm i` then commit lockfile |
| 4 | Server Action `createJob` | `app/(dashboard)/design/actions.ts` – Upstash `XADD` |
| 5 | Rate-limited API route | `app/api/design/route.ts` – Clerk auth + Ratelimit |
| 6 | Broadcast helper | switch to `@anycable/serverless-js` with Broadcast URL + key |
| 7 | Blob helper & progress publish | `src/lib/blob.ts` – upload preview/final, Redis updates |

---

## 3  Upstash Redis – Setup Guide (app data only)

Upstash is now **only** used for application data (queues, rate-limits, cache). AnyCable Cloud removes the Redis requirement for WebSocket broadcasting.

1. **Create DB** in Upstash console → type *Redis* → choose the region closest to your backend (e.g. `iad1`).
2. Copy:
   * `UPSTASH_REDIS_REST_URL`
   * `UPSTASH_REDIS_REST_TOKEN`
3. Add them to Vercel project settings and `.env.local`.

---

## 4  AnyCable Cloud Parameters

Add to `.env.local` / Vercel:

```dotenv
NEXT_PUBLIC_ANYCABLE_URL=wss://pixel-and-flow-ulbh.fly.dev/cable
ANYCABLE_BROADCAST_URL=https://pixel-and-flow-ulbh.fly.dev/_broadcast
ANYCABLE_BROADCAST_KEY=<broadcast-key-from-dashboard>
```

Use `@anycable/serverless-js` in server actions to broadcast:

```ts
import { createBroadcaster } from '@anycable/serverless-js'

const broadcaster = createBroadcaster({
  url: process.env.ANYCABLE_BROADCAST_URL!,
  token: process.env.ANYCABLE_BROADCAST_KEY!,
})

await broadcaster.broadcast('JobChannel', { id }, { progress: 42 })
```

---

## 5  Production Interaction Diagram

```
Browser  ──WS──>  AnyCable-Go (Fly)  ─TCP──>  Upstash Redis
                                      │
                                      └──HTTP──>  Next.js API Routes (Vercel)
                                                    ││  ↔ Clerk Auth
                                                    │└──↔ Vercel Blob
```
Flow (image generation):
1. Client POST `/api/design` → Server Action `createJob` → `XADD design:jobs`.
2. Worker processes job, publishes updates to `design:jobs:<id>` → AnyCable-Go broadcasts over `JobChannel`.
3. `useChannel` hook updates progress bar.
4. Worker uploads preview to Blob, publishes `lowres` URL → broadcast → UI swaps skeleton → preview.
5. Final image uploaded, status `completed` broadcast → UI shows final asset.

---

## 6  Next Steps Checklist (simplified)

- [ ] Fill `.env.local` & Vercel env with:
  - `NEXT_PUBLIC_ANYCABLE_URL`
  - `ANYCABLE_BROADCAST_URL`
  - `ANYCABLE_BROADCAST_KEY`
  - Upstash REST creds
- [ ] `pnpm i` and commit lockfile.
- [ ] Implement **Server Action** (`createJob`) – use broadcaster instead of Redis `PUBLISH`.
- [ ] Implement **API route** with Clerk auth + Upstash Ratelimit.
- [ ] Add **Blob helper** for preview/final image uploads & broadcaster calls.
- [ ] Deploy Next.js to Vercel – end-to-end real-time path goes live.

Once these boxes are ticked the original 7-step integration is fully complete and production-ready. 