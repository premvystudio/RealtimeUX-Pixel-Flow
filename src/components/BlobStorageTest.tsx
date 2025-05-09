'use client';

import { useState } from 'react';

export default function BlobStorageTest() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [error, setError] = useState('');

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/test-blob-upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }
      
      setUploadedUrl(result.url);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="my-8 p-6 border rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Blob Storage Test</h2>
      
      <div className="mb-4">
        <label className="block mb-2">
          Upload a file to test Vercel Blob:
        </label>
        <input 
          type="file" 
          onChange={handleFileUpload}
          disabled={isUploading}
          className="w-full"
        />
      </div>
      
      {isUploading && (
        <div className="my-4 text-blue-600">Uploading...</div>
      )}
      
      {error && (
        <div className="my-4 text-red-600">{error}</div>
      )}
      
      {uploadedUrl && (
        <div className="my-4">
          <p className="mb-2">File uploaded successfully!</p>
          <div className="break-all bg-gray-100 p-2 rounded">
            <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {uploadedUrl}
            </a>
          </div>
          {uploadedUrl.endsWith('.jpg') || 
           uploadedUrl.endsWith('.jpeg') || 
           uploadedUrl.endsWith('.png') || 
           uploadedUrl.endsWith('.gif') ? (
            <div className="mt-4">
              <img src={uploadedUrl} alt="Uploaded file" className="max-w-full rounded" />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
} 