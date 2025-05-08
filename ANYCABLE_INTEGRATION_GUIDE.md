# AnyCable + Next.js Full-Stack Integration Guide

> Copy-paste-and-ship strategy for a world-class, ultra-low-latency creative dashboard.

**Target stack**

| Layer | Technology |
|-------|------------|
| Hosting | Vercel (Next 15 App Router, edge & serverless runtimes) |
| Real-time transport | **AnyCable-Go** (WebSocket server) |
| Pub/Sub + Cache | **Upstash Redis** (HTTP-based, serverless pricing) |
| Auth & JWT | **Clerk** |
| Asset storage | **Vercel Blob** |

---

## 0  · Prerequisites  _(≈ 3 min)_

1. Install **pnpm** (or npm/yarn) and **Vercel CLI**.
2. Provision:
   - Upstash Redis database in the same Vercel region (e.g. `iad1`).
   - AnyCable-Go deployment (see Stage 4).
3. Create a **Clerk** application and enable a JWT template named `anycable`.
4. Enable **Vercel Blob** and copy its read-write token.
5. Add the following environment variables to Vercel (and `.env.local` for local dev):

```dotenv
NEXT_PUBLIC_ANYCABLE_URL=wss://<your-app>.vercel.app/cable
UPSTASH_REDIS_REST_URL=<...>
UPSTASH_REDIS_REST_TOKEN=<...>
CLERK_PUBLISHABLE_KEY=<...>
CLERK_SECRET_KEY=<...>
VERCEL_BLOB_READ_WRITE_TOKEN=<...>
```

---

## 1  · Install Runtime Dependencies  _(≈ 20 s)_

```bash
pnpm add @anycable/web @anycable/core isomorphic-ws \
         @upstash/redis @upstash/ratelimit \
         @clerk/nextjs@^5 @vercel/blob
```

`isomorphic-ws` guarantees `WebSocket` in all runtimes (edge & node).

---

## 2  · Wire AnyCable into Next.js

### 2.1  Create a singleton Cable
`src/lib/anycable.ts`
```ts
import { createCable, backoffWithJitter } from '@anycable/web'

export const cable = createCable({
  url: process.env.NEXT_PUBLIC_ANYCABLE_URL!,
  protocol: { encoder: 'json' },
  headers: async () => ({
    Authorization: `Bearer ${await getClerkJwt()}`,
  }),
  monitor: {
    enabled: true,
    backoff: backoffWithJitter({ min: 500, max: 8000, factor: 2 }),
  },
})

async function getClerkJwt() {
  const { getToken } = await import('@clerk/nextjs/server')
  return getToken({ template: 'anycable' }) || ''
}
```

### 2.2  React Hook for Channel Subscriptions
`src/hooks/useChannel.ts`
```ts
'use client'
import { useEffect } from 'react'
import { cable } from '@/lib/anycable'

export function useChannel<T>(
  identifier: string,
  params: Record<string, unknown>,
  onMessage: (data: T) => void,
) {
  useEffect(() => {
    const sub = cable.subscribe(identifier, params).on('message', onMessage)
    return () => sub.unsubscribe()
  }, [identifier, JSON.stringify(params)])
}
```

### 2.3  Example Component – Live Job Progress
`src/components/JobProgress.tsx`
```tsx
'use client'
import { useState } from 'react'
import { useChannel } from '@/hooks/useChannel'

export default function JobProgress({ id }: { id: string }) {
  const [pct, setPct] = useState(0)
  useChannel<{ progress: number }>('JobChannel', { id }, (e) => setPct(e.progress))

  return <progress value={pct} max={100} className="progress progress-accent" />
}
```

---

## 3  · Server Actions & API Routes

### 3.1  Upstash Redis Client
`src/lib/redis.ts`
```ts
import { Redis } from '@upstash/redis'
export const redis = Redis.fromEnv()
```

### 3.2  Enqueue a Design Job (Server Action)
`app/(dashboard)/design/actions.ts`
```ts
'use server'
import { redis } from '@/lib/redis'
import { currentUser } from '@clerk/nextjs/server'

export async function createJob(prompt: string) {
  const user = await currentUser()
  if (!user) throw new Error('unauthenticated')

  const id = crypto.randomUUID()
  await redis.xadd('design:jobs', '*', {
    id,
    user: user.id,
    prompt,
    status: 'pending',
  })
  return id
}
```

### 3.3  Edge-Optimised, Rate-Limited API Route
`app/api/design/route.ts`
```ts
import { createJob } from '@/app/(dashboard)/design/actions'
import { redis } from '@/lib/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { NextResponse } from 'next/server'

const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 m'),
})

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const { success } = await limiter.limit(ip)
  if (!success) return NextResponse.json({ error: 'slow down' }, { status: 429 })

  const { prompt } = await req.json()
  const id = await createJob(prompt)
  return NextResponse.json({ id })
}
```

---

## 4  · Deploy AnyCable-Go on Vercel

1. **`vercel.json`** – route WebSocket traffic:
   ```json
   {
     "rewrites": [
       { "source": "/cable", "destination": "http://anycable-go.internal:8080/cable" }
     ],
     "builds": [
       { "src": "api/anycable-go/Dockerfile", "use": "@vercel/docker" }
     ]
   }
   ```
2. **Dockerfile** – `api/anycable-go/Dockerfile`
   ```dockerfile
   FROM anycable/anycable-go:v1.4
   ENV ANYCABLE_REDIS_URL=${UPSTASH_REDIS_REST_URL}
   ENV ANYCABLE_LOG_LEVEL=info
   COPY ./anycable.yml /anycable.yml
   CMD ["anycable-go", "--config=/anycable.yml"]
   ```
3. **`anycable.yml`**
   ```yaml
   redis_url: <%= ENV['UPSTASH_REDIS_REST_URL'] %>
   jwt_id: anycable       # matches Clerk template
   jwt_secret: <%= ENV['CLERK_SECRET_KEY'] %>
   ```
4. Deploy with `vercel deploy --prod` – Vercel spins up a separate micro-service for AnyCable and proxies `/cable`.

---

## 5  · Vercel Blob + Live Asset Swap

`src/lib/blob.ts`
```ts
import { put } from '@vercel/blob'
import { redis } from '@/lib/redis'

export async function uploadPreview(file: Blob, id: string) {
  const url = await put(`previews/${id}.jpg`, file, {
    token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN!,
    access: 'public',
  })
  await redis.xadd(`design:jobs:${id}`, '*', { lowres: url })
  return url
}
```
AnyCable broadcasts the `lowres` URL; front-end swaps skeleton → blurred preview → full-res image when complete.

---

## 6  · Observability & Performance Guard-Rails

| Metric | How |
|--------|-----|
| WebSocket RTT | `@anycable/core` monitor → DataDog/Kinesis |
| p95 WS lag | Prometheus metrics from AnyCable micro-service |
| Client FPS | Lighthouse-CI on PRs (with WS HAR fixture) |
| Cold starts | Vercel Analytics → Edge Cold Start panel |

---

## 7  · "Launch in Minutes" Checklist

1. `pnpm i` — install deps.
2. `vercel link` — connect project.
3. Add environment variables (Stage 0).
4. `vercel deploy --prod` — Next.js & AnyCable build in parallel.
5. Open deployed URL → run design queue flow → watch skeleton → preview → final image.

---

### Continuous Improvement Ideas

- Switch JSON encoder to `msgpack` via `@anycable/msgpack-encoder` → 30 % smaller frames.
- Add Upstash Vector for "related designs" similarity search.
- Instrument stage timings (enqueue → first WS update → final) to surface live SLA in dev overlay.

> **Enjoy your "never-feels-clunky" creative platform!** 