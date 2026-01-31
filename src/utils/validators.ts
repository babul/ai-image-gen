export function validatePrompt(prompt: string): void {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt cannot be empty');
  }
}

export function validateSizeFormat(size: string): void {
  // Check for aspect ratio format (e.g., 3:2, 16:9)
  const aspectRatioRegex = /^\d+:\d+$/;
  // Check for dimensions format (e.g., 1024x768, 1920x1080)
  const dimensionsRegex = /^\d+x\d+$/i;

  if (!aspectRatioRegex.test(size) && !dimensionsRegex.test(size)) {
    throw new Error(
      'Invalid size format. Use aspect ratio (e.g., 3:2) or dimensions (e.g., 1024x768)'
    );
  }
}

export function validateQualityModel(quality: string, model: string): void {
  if (quality === 'hd' && model === 'dall-e-2') {
    throw new Error("Quality 'hd' requires dall-e-3 model");
  }
}

export function validateFormat(format: string): void {
  const validFormats = ['png', 'jpg', 'webp'];
  if (!validFormats.includes(format.toLowerCase())) {
    throw new Error(`Invalid format. Use one of: ${validFormats.join(', ')}`);
  }
}
