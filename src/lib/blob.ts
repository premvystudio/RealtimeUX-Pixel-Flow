/**
 * @deprecated Use design-service.ts instead
 */

import { uploadPreview as uploadPreviewImpl } from './design-service';

export async function uploadPreview(id: string, file: Blob) {
  return uploadPreviewImpl(id, file);
} 