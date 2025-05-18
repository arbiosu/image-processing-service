import sharp from 'sharp';

export interface ProcessImageResult {
  buffer: Buffer<ArrayBufferLike>;
  path: string;
  width: number;
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
