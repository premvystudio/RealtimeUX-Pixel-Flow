import { NextResponse } from 'next/server';
import { StorageService } from '../../../lib/storage-service';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Convert File to Buffer for the upload
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Use our StorageService to upload the file
    const result = await StorageService.uploadFile(buffer, {
      prefix: 'test-uploads',
      filename: file.name,
      addRandomSuffix: true,
    });
    
    return NextResponse.json({ 
      success: true, 
      url: result.url,
      id: result.id,
      size: result.size 
    });
    
  } catch (error: any) {
    console.error('Upload test error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
} 