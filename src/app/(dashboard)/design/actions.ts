// @ts-nocheck
'use server'

import { EventService, EventType } from '../../../lib/event-service';
import { DesignRepository } from '../../../lib/design-repository';
import { currentUser } from '@clerk/nextjs/server';

export async function createJob(prompt: string) {
  const user = await currentUser();
  if (!user) throw new Error('unauthenticated');

  // Create design job in repository
  const id = await DesignRepository.createJob(user.id, prompt);

  // Optimistic UI broadcast
  await EventService.notify(
    'JobChannel', 
    EventType.UPLOAD_STARTED, 
    { id }, 
    { status: 'pending', progress: 0 }
  );

  return id;
} 