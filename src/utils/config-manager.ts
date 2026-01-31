import { promises as fs } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import type { Config } from '../types/index.js';

const CONFIG_DIR = join(homedir(), '.ai-image-gen');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

export async function ensureConfigDir(): Promise<void> {
  try {
    await fs.access(CONFIG_DIR);
  } catch {
    await fs.mkdir(CONFIG_DIR, { recursive: true, mode: 0o700 });
  }
}

export async function loadConfig(): Promise<Config> {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export async function saveConfig(config: Config): Promise<void> {
  await ensureConfigDir();
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), {
    mode: 0o600,
  });
}

export async function getConfigValue(key: string): Promise<string | undefined> {
  const config = await loadConfig();
  return config[key];
}

export async function setConfigValue(key: string, value: string): Promise<void> {
  const config = await loadConfig();
  config[key] = value;
  await saveConfig(config);
}

export async function deleteConfigValue(key: string): Promise<boolean> {
  const config = await loadConfig();
  if (key in config) {
    delete config[key];
    await saveConfig(config);
    return true;
  }
  return false;
}

export async function getApiKey(): Promise<string | undefined> {
  // Priority: env variable > config file
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }
  return await getConfigValue('OPENAI_API_KEY');
}

export function validateApiKey(apiKey: string | undefined): void {
  if (!apiKey) {
    const errorMessage = [
      'OpenAI API key not found.',
      '',
      'To set your API key, run:',
      '  node bin/cli.js config set OPENAI_API_KEY sk-xxxxx',
      '',
      'Or set the environment variable:',
      '  export OPENAI_API_KEY=sk-xxxxx',
    ].join('\n');
    throw new Error(errorMessage);
  }
}
