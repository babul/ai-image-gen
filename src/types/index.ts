export interface DallESize {
  width: 1024 | 1792;
  height: 1024 | 1792;
}

export type DallESizeString = '1024x1024' | '1792x1024' | '1024x1792';

export interface PostProcessConfig {
  width: number;
  height: number;
  method: 'crop' | 'resize';
}

export interface SizeMapping {
  dalleSize: DallESizeString;
  postProcess?: PostProcessConfig;
}

export interface GenerateOptions {
  size?: string;
  output?: string;
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  model?: string;
  format?: 'png' | 'jpg' | 'webp';
}

export interface Config {
  OPENAI_API_KEY?: string;
  [key: string]: string | undefined;
}

export interface ImageMetadata {
  path: string;
  width: number;
  height: number;
  size: number;
  format: string;
}
