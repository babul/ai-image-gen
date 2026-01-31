import { Command } from 'commander';
import chalk from 'chalk';
import {
  getConfigValue,
  setConfigValue,
  deleteConfigValue,
  loadConfig,
} from '../utils/config-manager.js';

export function createConfigCommand(): Command {
  const config = new Command('config')
    .description('Manage configuration settings');

  config
    .command('set <key> <value>')
    .description('Set a configuration value')
    .action(async (key: string, value: string) => {
      try {
        await setConfigValue(key, value);
        console.log(chalk.green(`✓ ${key} has been set`));
      } catch (error) {
        console.error(chalk.red(`Error: ${(error as Error).message}`));
        process.exit(1);
      }
    });

  config
    .command('get <key>')
    .description('Get a configuration value')
    .action(async (key: string) => {
      try {
        const value = await getConfigValue(key);
        if (value) {
          console.log(value);
        } else {
          console.log(chalk.yellow(`${key} is not set`));
        }
      } catch (error) {
        console.error(chalk.red(`Error: ${(error as Error).message}`));
        process.exit(1);
      }
    });

  config
    .command('delete <key>')
    .alias('remove')
    .description('Delete a configuration value')
    .action(async (key: string) => {
      try {
        const deleted = await deleteConfigValue(key);
        if (deleted) {
          console.log(chalk.green(`✓ ${key} has been deleted`));
        } else {
          console.log(chalk.yellow(`${key} is not set`));
        }
      } catch (error) {
        console.error(chalk.red(`Error: ${(error as Error).message}`));
        process.exit(1);
      }
    });

  config
    .command('list')
    .description('List all configuration values')
    .action(async () => {
      try {
        const configData = await loadConfig();
        const keys = Object.keys(configData);

        if (keys.length === 0) {
          console.log(chalk.yellow('No configuration values set'));
          return;
        }

        console.log(chalk.bold('Configuration:'));
        keys.forEach((key) => {
          const value = configData[key];
          // Mask API keys for security
          const displayValue = key.includes('KEY')
            ? value?.substring(0, 8) + '...'
            : value;
          console.log(`  ${chalk.cyan(key)}: ${displayValue}`);
        });
      } catch (error) {
        console.error(chalk.red(`Error: ${(error as Error).message}`));
        process.exit(1);
      }
    });

  return config;
}
