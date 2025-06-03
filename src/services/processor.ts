import sharp from 'sharp';
import { uploadProcessedImage } from './upload.js';

export interface ProcessImageResult {
  buffer: Buffer<ArrayBufferLike>;
  path: string;
  width: number;
}

export interface ProcessAndUploadImageResult {
  success: boolean;
  paths: string[] | null;
  error: string | null;
}

export async function processImage(
  imageBuffer: Buffer,
  filename: string,
  widths: number[]
): Promise<ProcessImageResult[]> {
  const resizedImages = await Promise.all(
    widths.map(async (width) => {
      const newPath = `${filename}-${width}w.webp`;
      const sharpBuffer = await sharp(imageBuffer)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ nearLossless: true, quality: 50 })
        .toBuffer();
      return { buffer: sharpBuffer, path: newPath, width: width };
    })
  );
  return resizedImages;
}

export async function processAndUploadImage(
  imageBuffer: Buffer,
  filename: string,
  widths: number[]
): Promise<ProcessAndUploadImageResult> {
  const paths: string[] = [];
  try {
    for (const width of widths) {
      const newPath = `${filename}-${width}w.webp`;
      const sharpBuffer = await sharp(imageBuffer)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ nearLossless: true, quality: 50 })
        .toBuffer();
      const { success, path, error } = await uploadProcessedImage({
        buffer: sharpBuffer,
        path: newPath,
        width: width,
      });

      if (error || !success || !path) {
        throw new Error('uploadProcessedImage error');
      }
      paths.push(path.path);
    }
    return {
      success: true,
      paths: paths,
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
