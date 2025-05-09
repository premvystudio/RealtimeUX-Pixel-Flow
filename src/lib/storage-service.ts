import { put, del, list, head } from '@vercel/blob';
import { nanoid } from 'nanoid';

export type UploadResult = {
  id: string;
  url: string;
  pathname: string;
  size: number;
};

export class StorageService {
  /**
   * Upload a file to Vercel Blob storage
   */
  static async uploadFile(
    file: Blob | Buffer, 
    options: { 
      prefix?: string;
      extension?: string;
      access?: 'public';
      addRandomSuffix?: boolean;
      filename?: string;
    } = {}
  ): Promise<UploadResult> {
    const { 
      prefix = 'uploads',
      extension = '',
      access = 'public',
      addRandomSuffix = true,
      filename
    } = options;
    
    // Generate unique filename if not provided
    let finalFilename = filename || '';
    if (!finalFilename || addRandomSuffix) {
      const uniqueId = nanoid(10);
      finalFilename = filename 
        ? `${filename.split('.')[0]}-${uniqueId}${extension ? `.${extension}` : ''}`
        : `${uniqueId}${extension ? `.${extension}` : ''}`;
    }
    
    // Construct path with proper structure
    const pathname = `${prefix}/${finalFilename}`;
    
    try {
      // Upload to Vercel Blob
      const { url, pathname: resultPath } = await put(pathname, file, { access });
      
      return {
        id: finalFilename,
        url,
        pathname: resultPath,
        size: file instanceof Blob ? file.size : file.length,
      };
    } catch (error) {
      console.error('File upload failed:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }
  
  /**
   * Delete a file from Vercel Blob storage
   */
  static async deleteFile(pathname: string): Promise<boolean> {
    try {
      await del(pathname);
      return true;
    } catch (error) {
      console.error('File deletion failed:', error);
      return false;
    }
  }
  
  /**
   * List files with a specific prefix
   */
  static async listFiles(prefix: string): Promise<any[]> {
    try {
      const { blobs } = await list({ prefix });
      return blobs;
    } catch (error) {
      console.error('Listing files failed:', error);
      return [];
    }
  }
} 