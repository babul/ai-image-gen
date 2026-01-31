#!/usr/bin/env node
import { Command } from 'commander';
import { createGenerateCommand } from './commands/generate.js';
import { createConfigCommand } from './commands/config.js';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

program
  .name('ai-image-gen')
  .description('AI-powered image generator CLI using OpenAI DALL-E')
  .version(packageJson.version);

// Add commands
program.addCommand(createGenerateCommand());
program.addCommand(createConfigCommand());

// Parse arguments
program.parse(process.argv);
