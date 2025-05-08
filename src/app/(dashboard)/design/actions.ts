// @ts-nocheck
'use server'

import { broadcaster } from '../../../lib/broadcaster'
import { redis } from '../../../lib/redis'
import { currentUser } from '@clerk/nextjs/server'
import { randomUUID } from 'crypto'

export async function createJob(prompt: string) {
  const user = await currentUser()
  if (!user) throw new Error('unauthenticated')

  const id = randomUUID()

  // Persist minimal job state for workers
  await redis.xadd('design:jobs', '*', {
    id,
    prompt,
    status: 'pending',
    created_at: Date.now(),
  })

  // Optimistic UI broadcast
  await broadcaster.broadcast('JobChannel', { id }, { status: 'pending', progress: 0 })

  return id
} 