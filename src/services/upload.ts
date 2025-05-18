import { createSupabaseClient } from '../lib/supabase/client.js';
import { type ProcessImageResult } from './processor.js';

interface SupabaseImageUploadSuccessResponse {
  id: string;
  path: string;
  fullPath: string;
}

interface UploadProcessedImagesResponse {
  success: boolean;
  paths: SupabaseImageUploadSuccessResponse[] | null;
  error: string | null;
}

export async function uploadProcessedImages(
  images: ProcessImageResult[]
): Promise<UploadProcessedImagesResponse> {
  try {
    const supabase = await createSupabaseClient();

    const pathList: SupabaseImageUploadSuccessResponse[] = [];
    for (const image of images) {
      const { data: imageUpload, error: imageUploadError } =
        await supabase.storage.from('images').upload(image.path, image.buffer, {
          contentType: 'image/webp',
          cacheControl: '31536000',
        });

      if (imageUploadError)
        throw new Error(
          `[Supabase Storage Error] ${imageUploadError.name}: ${imageUploadError.message} with cause: ${imageUploadError.cause || 'UNKNOWN'}`
        );

      pathList.push(imageUpload);
    }
    return {
      success: true,
      paths: pathList,
      error: null,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return {
        success: false,
        paths: null,
        error: error.message,
      };
    }
    return {
      success: false,
      paths: null,
      error: 'An unknown error has occurred with uploadProcessedImages',
    };
  }
}
