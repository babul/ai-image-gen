import OpenAI from 'openai';
import type { DallESizeString } from '../types/index.js';

export async function generateImage(
  apiKey: string,
  prompt: string,
  size: DallESizeString,
  quality: 'standard' | 'hd' = 'standard',
  style: 'vivid' | 'natural' = 'natural',
  model: string = 'dall-e-3'
): Promise<string> {
  const client = new OpenAI({ apiKey });

  try {
    const response = await client.images.generate({
      model,
      prompt,
      size,
      quality,
      style,
      n: 1,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No image data returned from OpenAI');
    }

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    return imageUrl;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
    throw error;
  }
}
