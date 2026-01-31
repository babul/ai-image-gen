import sharp from 'sharp';
import { writeFile } from 'fs/promises';
import type { PostProcessConfig, ImageMetadata } from '../types/index.js';

export async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function processImage(
  imageBuffer: Buffer,
  postProcess: PostProcessConfig | undefined,
  outputPath: string,
  format: 'png' | 'jpg' | 'webp' = 'png'
): Promise<ImageMetadata> {
  let image = sharp(imageBuffer);

  // Apply post-processing if needed
  if (postProcess) {
    const { width, height, method } = postProcess;

    if (method === 'crop') {
      // Cover strategy: resize to fill the target dimensions, then crop
      image = image.resize(width, height, {
        fit: 'cover',
        position: 'center',
      });
    } else {
      // Resize strategy: fit within dimensions
      image = image.resize(width, height, {
        fit: 'inside',
      });
    }
  }

  // Convert format if needed
  if (format === 'jpg') {
    image = image.jpeg({ quality: 90 });
  } else if (format === 'webp') {
    image = image.webp({ quality: 90 });
  } else {
    image = image.png({ compressionLevel: 9 });
  }

  // Process and get metadata
  const buffer = await image.toBuffer();
  const metadata = await sharp(buffer).metadata();

  // Write to file
  await writeFile(outputPath, buffer);

  return {
    path: outputPath,
    width: metadata.width || 0,
    height: metadata.height || 0,
    size: buffer.length,
    format: metadata.format || format,
  };
}
