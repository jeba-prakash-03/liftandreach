import { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  }
});

export const handleImageUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image uploaded' });
      return;
    }

    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filenameBase = `product-${Date.now()}-${Math.round(Math.random() * 1e4)}`;
    const webpFilename = `${filenameBase}.webp`;
    const jpegFilename = `${filenameBase}.jpg`;

    const webpPath = path.join(uploadDir, webpFilename);
    const jpegPath = path.join(uploadDir, jpegFilename);

    // Convert to webp with high quality
    await sharp(req.file.buffer)
      .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(webpPath);

    // JPEG fallback
    await sharp(req.file.buffer)
      .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(jpegPath);

    res.json({
      success: true,
      url: `/uploads/${webpFilename}`,
      fallbackUrl: `/uploads/${jpegFilename}`
    });
  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({ error: 'Failed to process and optimize image.' });
  }
};
