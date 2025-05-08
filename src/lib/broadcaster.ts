// @ts-ignore – package typings may be outdated
import createBroadcaster from '@anycable/serverless-js'

export const broadcaster = createBroadcaster({
  url: process.env.ANYCABLE_BROADCAST_URL || '',
  token: process.env.ANYCABLE_BROADCAST_KEY || '',
}) 