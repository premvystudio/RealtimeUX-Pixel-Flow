// @ts-nocheck
import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { redis } from '../../../lib/redis'
import { DesignRepository } from '../../../lib/design-repository'
import { getAuth } from '@clerk/nextjs/server'

export const runtime = 'edge'

const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 m'),
})

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0]
  const { success } = await limiter.limit(ip)
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  // @ts-ignore - Clerk types have issues with Next.js 14+
  const { userId } = getAuth(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { prompt } = await req.json()
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 })
  }

  try {
    const id = await DesignRepository.createJob(userId, prompt)
    return NextResponse.json({ id })
  } catch (error) {
    console.error('Design creation error:', error)
    return NextResponse.json({ error: 'Failed to create design' }, { status: 500 })
  }
} 