import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { downloadImage } from '../services/download.js';
import { processAndUploadImage } from '../services/processor.js';
import { auth } from '../middlewares/auth.js';

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
      const resized = await processAndUploadImage(buffer, imagePath, widths);
      if (resized.error) {
        throw new Error(resized.error);
      }
      return c.json(
        {
          success: true,
          message: 'Images resized and uploaded',
          paths: resized.paths,
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
