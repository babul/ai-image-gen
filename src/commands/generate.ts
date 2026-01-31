import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { resolve } from 'path';
import type { GenerateOptions } from '../types/index.js';
import { validatePrompt, validateSizeFormat, validateQualityModel, validateFormat } from '../utils/validators.js';
import { getApiKey, validateApiKey } from '../utils/config-manager.js';
import { mapSize } from '../utils/size-mapper.js';
import { generateImage } from '../services/openai.js';
import { downloadImage, processImage } from '../services/image-processor.js';

export function createGenerateCommand(): Command {
  const generate = new Command('generate')
    .alias('gen')
    .description('Generate an AI image from a text prompt')
    .argument('<prompt>', 'Image description')
    .option('-s, --size <size>', 'Aspect ratio (3:2) or dimensions (1024x768)', '1024x1024')
    .option('-o, --output <path>', 'Output file path')
    .option('-q, --quality <quality>', 'Image quality (standard|hd)', 'standard')
    .option('--style <style>', 'Image style (vivid|natural)', 'natural')
    .option('-m, --model <model>', 'OpenAI model', 'dall-e-3')
    .option('-f, --format <format>', 'Output format (png|jpg|webp)', 'png')
    .action(async (prompt: string, options: GenerateOptions) => {
      try {
        // Validate inputs
        validatePrompt(prompt);
        validateSizeFormat(options.size || '1024x1024');
        validateFormat(options.format || 'png');
        validateQualityModel(
          options.quality || 'standard',
          options.model || 'dall-e-3'
        );

        // Get API key
        const apiKey = await getApiKey();
        validateApiKey(apiKey);

        // Map size to DALL-E size
        const sizeMapping = mapSize(options.size);

        // Generate image
        const spinner = ora('Generating image...').start();
        const imageUrl = await generateImage(
          apiKey!,
          prompt,
          sizeMapping.dalleSize,
          options.quality as 'standard' | 'hd',
          options.style as 'vivid' | 'natural',
          options.model
        );
        spinner.succeed('Image generated');

        // Download and process image
        spinner.start('Processing image...');
        const imageBuffer = await downloadImage(imageUrl);

        // Use provided output path or generate default
        const outputFilePath = options.output || `./image-${Date.now()}.png`;
        const outputPath = resolve(outputFilePath);

        const metadata = await processImage(
          imageBuffer,
          sizeMapping.postProcess,
          outputPath,
          options.format as 'png' | 'jpg' | 'webp'
        );

        spinner.succeed('Image processed');

        // Display success
        const sizeKB = (metadata.size / 1024).toFixed(2);
        console.log(
          chalk.green(
            `✓ Image saved to ${chalk.bold(metadata.path)} (${metadata.width}x${metadata.height}, ${sizeKB}KB)`
          )
        );
      } catch (error) {
        console.error(chalk.red(`✗ ${(error as Error).message}`));
        process.exit(1);
      }
    });

  return generate;
}
