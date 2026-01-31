import type { SizeMapping, DallESizeString } from '../types/index.js';

interface ParsedSize {
  width: number;
  height: number;
}

function parseSize(sizeStr: string): ParsedSize {
  // Check if it's an aspect ratio (e.g., 3:2, 16:9)
  if (sizeStr.includes(':')) {
    const [widthRatio, heightRatio] = sizeStr.split(':').map(Number);

    // Calculate dimensions maintaining the aspect ratio
    // Use 1024 as base for smaller dimension
    if (widthRatio > heightRatio) {
      // Landscape
      const height = 1024;
      const width = Math.round((height * widthRatio) / heightRatio);
      return { width, height };
    } else if (heightRatio > widthRatio) {
      // Portrait
      const width = 1024;
      const height = Math.round((width * heightRatio) / widthRatio);
      return { width, height };
    } else {
      // Square
      return { width: 1024, height: 1024 };
    }
  }

  // Otherwise, it's dimensions (e.g., 1024x768)
  const [width, height] = sizeStr.toLowerCase().split('x').map(Number);
  return { width, height };
}

function selectDallESize(targetWidth: number, targetHeight: number): DallESizeString {
  const aspectRatio = targetWidth / targetHeight;

  // DALL-E sizes: 1024x1024 (1:1), 1792x1024 (16:9 landscape), 1024x1792 (9:16 portrait)

  if (Math.abs(aspectRatio - 1) < 0.1) {
    // Close to square
    return '1024x1024';
  } else if (aspectRatio > 1) {
    // Landscape - use 1792x1024
    return '1792x1024';
  } else {
    // Portrait - use 1024x1792
    return '1024x1792';
  }
}

export function mapSize(sizeStr: string = '1024x1024'): SizeMapping {
  const { width: targetWidth, height: targetHeight } = parseSize(sizeStr);

  const dalleSize = selectDallESize(targetWidth, targetHeight);
  const [dalleWidth, dalleHeight] = dalleSize.split('x').map(Number);

  // If target size matches DALL-E size exactly, no post-processing needed
  if (targetWidth === dalleWidth && targetHeight === dalleHeight) {
    return { dalleSize };
  }

  // Determine if we should crop or resize
  const targetAspectRatio = targetWidth / targetHeight;
  const dalleAspectRatio = dalleWidth / dalleHeight;

  // If aspect ratios are very close, just resize
  // Otherwise, we'll need to crop
  const method = Math.abs(targetAspectRatio - dalleAspectRatio) < 0.01 ? 'resize' : 'crop';

  return {
    dalleSize,
    postProcess: {
      width: targetWidth,
      height: targetHeight,
      method,
    },
  };
}
