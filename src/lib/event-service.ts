import { broadcast } from './broadcaster';

export enum EventType {
  UPLOAD_STARTED = 'upload_started',
  UPLOAD_PROGRESS = 'upload_progress',
  UPLOAD_COMPLETED = 'upload_completed',
  PROCESSING_STARTED = 'processing_started',
  PROCESSING_PROGRESS = 'processing_progress',
  PROCESSING_COMPLETED = 'processing_completed',
  ERROR = 'error',
}

export class EventService {
  /**
   * Send an event notification through AnyCable
   */
  static async notify(
    channelName: string,
    eventType: EventType,
    id: Record<string, string>,
    data: Record<string, any>
  ): Promise<boolean> {
    try {
      // Add event type to payload
      const payload = {
        ...data,
        event: eventType,
        timestamp: Date.now(),
      };
      
      // Send through broadcaster
      return await broadcast(channelName, id, payload);
    } catch (error) {
      console.error('Event notification failed:', error);
      return false;
    }
  }
} 