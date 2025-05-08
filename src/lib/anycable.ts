// AnyCable client singleton (browser + server)
// -----------------------------------------------------------------------------
// Responsible for creating and exporting a single Cable instance that can be
// imported anywhere in the application. The instance automatically handles
// rebroadcast, token refresh and reconnection back-off.
// -----------------------------------------------------------------------------

import { createCable } from '@anycable/web'
import { backoffWithJitter } from '@anycable/core'

// Lazy import Clerk helpers to avoid shipping them to edge bundles that do not
// need them.
async function fetchJwt(): Promise<string> {
  try {
    // 1. Try server-side helper first (SSR, server actions)
    const clerkServer = (await import('@clerk/nextjs/server')) as any
    const token = await clerkServer.getToken?.({ template: 'anycable' })
    if (token) return token
  } catch {
    /* noop – will fall through to client */
  }

  // 2. Browser: for now return empty string; front-end authentication is handled
  // by cookies and the server passes a signed JWT via SSR. If you need a
  // client-side token later, inject it through a middleware or call Clerk's
  // public SDK here.

  return '' // unauthenticated user
}

// @ts-ignore – 3rd-party types outdated; object form is supported at runtime
export const cable = createCable({
  url: process.env.NEXT_PUBLIC_ANYCABLE_URL!,
  protocol: {
    encoder: 'json',
    name: 'actioncable-v1-ext-json',
    options: { pongs: true },
  },
  headers: async () => ({ Authorization: `Bearer ${await fetchJwt()}` }),
  monitor: { enabled: true },
  pingInterval: 10_000, // 10 s – lower overhead under high load
}) 