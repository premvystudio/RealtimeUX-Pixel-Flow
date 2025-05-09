import { redis } from './redis';
import { StorageService, UploadResult } from './storage-service';
import { nanoid } from 'nanoid';

export type DesignRecord = {
  id: string;
  prompt: string;
  previewUrl?: string;
  previewPath?: string; 
  finalUrl?: string;
  finalPath?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  userId: string;
  createdAt: number;
  updatedAt: number;
};

export class DesignRepository {
  /**
   * Create a new design job
   */
  static async createJob(userId: string, prompt: string): Promise<string> {
    const id = nanoid();
    const now = Date.now();
    
    const job: DesignRecord = {
      id,
      prompt,
      status: 'pending',
      progress: 0,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    
    // Store in Redis
    await redis.hset(`designs:${id}`, job);
    
    // Add to user's designs list
    await redis.sadd(`user:${userId}:designs`, id);
    
    // Add to processing queue
    await redis.xadd('design:jobs', '*', {
      id,
      prompt,
      status: 'pending',
      created_at: now,
    });
    
    return id;
  }
  
  /**
   * Update a design job with preview image
   */
  static async updateJobPreview(id: string, uploadResult: UploadResult): Promise<DesignRecord> {
    // Get current job
    const job = await redis.hgetall(`designs:${id}`) as DesignRecord;
    if (!job) throw new Error('Design job not found');
    
    // Update job with preview info
    const updatedJob: DesignRecord = {
      ...job,
      previewUrl: uploadResult.url,
      previewPath: uploadResult.pathname,
      status: 'processing',
      progress: 50,
      updatedAt: Date.now(),
    };
    
    // Save updated job
    await redis.hset(`designs:${id}`, updatedJob);
    
    return updatedJob;
  }
  
  /**
   * Get a design job by ID
   */
  static async getJob(id: string): Promise<DesignRecord | null> {
    const job = await redis.hgetall(`designs:${id}`);
    return job as DesignRecord || null;
  }
  
  /**
   * Get all design jobs for a user
   */
  static async getUserJobs(userId: string): Promise<DesignRecord[]> {
    const jobIds = await redis.smembers(`user:${userId}:designs`);
    if (!jobIds.length) return [];
    
    // Get all jobs in parallel
    const jobs = await Promise.all(
      jobIds.map(id => redis.hgetall(`designs:${id}`))
    );
    
    return jobs as DesignRecord[];
  }
  
  /**
   * Delete a design job and associated files
   */
  static async deleteJob(id: string, userId: string): Promise<boolean> {
    const job = await redis.hgetall(`designs:${id}`) as DesignRecord;
    if (!job) return false;
    
    // Delete associated files if they exist
    if (job.previewPath) {
      await StorageService.deleteFile(job.previewPath);
    }
    
    if (job.finalPath) {
      await StorageService.deleteFile(job.finalPath);
    }
    
    // Remove from user's designs list
    await redis.srem(`user:${userId}:designs`, id);
    
    // Delete job data
    await redis.del(`designs:${id}`);
    
    return true;
  }
} 