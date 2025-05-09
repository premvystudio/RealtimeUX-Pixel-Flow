import { StorageService } from './storage-service';
import { EventService, EventType } from './event-service';

/**
 * Upload a design preview image and notify clients
 */
export async function uploadPreview(id: string, file: Blob): Promise<string> {
  try {
    // Notify of upload starting
    await EventService.notify(
      'JobChannel', 
      EventType.UPLOAD_STARTED, 
      { id }, 
      { progress: 0 }
    );
    
    // Upload file to Vercel Blob
    const result = await StorageService.uploadFile(file, {
      prefix: 'previews',
      extension: 'jpg',
      filename: id,
      addRandomSuffix: false,
    });
    
    // Notify of upload completed with 50% progress (assuming further processing will happen)
    await EventService.notify(
      'JobChannel', 
      EventType.PROCESSING_PROGRESS, 
      { id }, 
      { lowres: result.url, progress: 50 }
    );
    
    return result.url;
  } catch (error) {
    // Notify of error
    await EventService.notify(
      'JobChannel', 
      EventType.ERROR, 
      { id }, 
      { error: error.message }
    );
    
    throw error;
  }
} 