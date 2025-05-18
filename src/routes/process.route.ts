import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { downloadImage } from '../services/download.js';
import { processImage } from '../services/processor.js';
import { auth } from '../middlewares/auth.js';
import { uploadProcessedImages } from '../services/upload.js';

const processRoutes = new Hono();
processRoutes.use('*', auth);

const processImageSchema = z.object({
  imagePath: z.string(),
});

const widths = [320, 640, 960, 1280, 1920];

processRoutes.post(
  '/process',
  zValidator('json', processImageSchema),
  async (c) => {
    try {
      const { imagePath } = c.req.valid('json');

      const { buffer, error } = await downloadImage(imagePath);
      if (error || !buffer) {
        throw new Error(
          `Error downloading image: ${error || 'Buffer is null'}`
        );
      }
      const resizedImages = await processImage(buffer, imagePath, widths);
      const uploaded = await uploadProcessedImages(resizedImages);
      if (uploaded.error) {
        throw new Error(uploaded.error);
      }
      return c.json(
        {
          success: true,
          message: 'Images resized and uploaded',
          paths: uploaded.paths,
        },
        200
      );
    } catch (e) {
      console.error(e);
      return c.json(
        {
          success: false,
          message: 'Failed!',
          paths: null,
        },
        500
      );
    }
  }
);

export default processRoutes;
