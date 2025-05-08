'use client'
// @ts-nocheck

import { useEffect, useRef } from 'react'
import { cable } from '../lib/anycable'

/**
 * Subscribe to an AnyCable channel and run a callback on incoming messages.
 * Returns true/false connection state via a ref so the consuming component can
 * read without re-rendering on every status tick.
 */
export function useChannel<T>(
  identifier: string,
  params: Record<string, unknown>,
  onMessage: (data: T) => void,
) {
  const connected = useRef(false)

  useEffect(() => {
    const sub: any = cable.subscribe(identifier, params)
    sub
      .on('message', onMessage)
      .on('connect', () => (connected.current = true))
      .on('disconnect', () => (connected.current = false))
      .on('reject', (err: unknown) => console.error('Subscription rejected', err))

    return () => sub.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier, JSON.stringify(params), onMessage])

  return connected
} 