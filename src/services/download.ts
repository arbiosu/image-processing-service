import { createSupabaseClient } from '../lib/supabase/client.js';

interface DownloadImageResponse {
  success: boolean;
  buffer: Buffer<ArrayBuffer> | null;
  error: string | null;
}

export async function downloadImage(
  imagePath: string
): Promise<DownloadImageResponse> {
  try {
    const supabase = await createSupabaseClient();
    const { data: image, error: imageError } = await supabase.storage
      .from('images')
      .download(imagePath);

    if (imageError)
      throw new Error(
        `[Supabase download Error] ${imageError.name}: ${imageError.message} with cause ${imageError.cause || 'UNKNOWN'}`
      );

    if (!image) {
      return {
        success: false,
        buffer: null,
        error: 'Image is null/empty!',
      };
    }
    const buffer = Buffer.from(await image.arrayBuffer());
    return {
      success: true,
      buffer: buffer,
      error: null,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return {
        success: false,
        buffer: null,
        error: error.message,
      };
    }
    return {
      success: false,
      buffer: null,
      error: 'An unknown error has occurred with downloadImage',
    };
  }
}
