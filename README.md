# AI Image Generator CLI

A TypeScript-based command-line tool for generating AI images with custom sizes using OpenAI DALL-E.

## Features

- Generate AI images from text prompts using DALL-E 3
- Support for custom aspect ratios (e.g., 3:2, 16:9) and dimensions (e.g., 1920x1080)
- Automatic image resizing and cropping to exact specifications
- Multiple output formats (PNG, JPG, WebP)
- Quality options (standard, HD)
- Style options (natural, vivid)
- Secure API key management

## Installation

### Using npx (Recommended - No Installation Required)

```bash
npx @tmgbabul/ai-image-gen generate "A serene mountain landscape" --size 3:2
```

### Global Installation

```bash
npm install -g @tmgbabul/ai-image-gen
@tmgbabul/ai-image-gen generate "A serene mountain landscape" --size 3:2
```

### Local Project Installation

```bash
npm install @tmgbabul/ai-image-gen
npx @tmgbabul/ai-image-gen generate "A serene mountain landscape" --size 3:2
```

## Configuration

Before using the CLI, set your OpenAI API key:

```bash
npx @tmgbabul/ai-image-gen config set OPENAI_API_KEY sk-xxxxx
```

Alternatively, set the environment variable:

```bash
export OPENAI_API_KEY=sk-xxxxx
```

### Configuration Commands

```bash
# Set a config value
npx @tmgbabul/ai-image-gen config set OPENAI_API_KEY sk-xxxxx

# Get a config value
npx @tmgbabul/ai-image-gen config get OPENAI_API_KEY

# Delete a config value
npx @tmgbabul/ai-image-gen config delete OPENAI_API_KEY

# List all config values
npx @tmgbabul/ai-image-gen config list
```

Configuration is stored in `~/.@tmgbabul/ai-image-gen/config.json`.

## Usage

### Basic Usage

```bash
npx @tmgbabul/ai-image-gen generate "A serene mountain landscape at sunset"
```

If installed globally:
```bash
@tmgbabul/ai-image-gen generate "A serene mountain landscape at sunset"
```

### With Options

```bash
# Generate with custom aspect ratio
npx @tmgbabul/ai-image-gen generate "Blog header image" --size 3:2 --output header.png

# Generate with custom dimensions
npx @tmgbabul/ai-image-gen gen "Featured image" -s 1920x1080 -o featured.png

# Generate with HD quality and vivid style
npx @tmgbabul/ai-image-gen gen "Sunset over ocean" -s 16:9 -q hd --style vivid

# Generate as JPG
npx @tmgbabul/ai-image-gen gen "Product photo" -s 1024x768 -f jpg
```

### Command Options

| Option | Alias | Type | Default | Description |
|--------|-------|------|---------|-------------|
| `<prompt>` | - | string | required | Image description |
| `--size` | `-s` | string | `1024x1024` | Aspect ratio (3:2) or dimensions (1024x768) |
| `--output` | `-o` | string | `./image-{timestamp}.png` | Output file path |
| `--quality` | `-q` | enum | `standard` | `standard` or `hd` |
| `--style` | - | enum | `natural` | `vivid` or `natural` |
| `--model` | `-m` | string | `dall-e-3` | OpenAI model |
| `--format` | `-f` | enum | `png` | `png`, `jpg`, `webp` |

### Common Use Cases

**Blog post hero image (3:2 aspect ratio):**
```bash
npx @tmgbabul/ai-image-gen gen "Modern office workspace" -s 3:2 -o blog-hero.png
```

**Wide banner (16:9):**
```bash
npx @tmgbabul/ai-image-gen gen "Technology background" -s 16:9 -q hd
```

**Social media post (1080x1080):**
```bash
npx @tmgbabul/ai-image-gen gen "Inspirational quote background" -s 1080x1080
```

**Custom dimensions:**
```bash
npx @tmgbabul/ai-image-gen gen "Website header" -s 1920x600 -f webp
```

## How It Works

DALL-E only supports three fixed sizes: 1024x1024, 1792x1024, and 1024x1792. This CLI handles custom sizes by:

1. Mapping your requested size to the closest DALL-E size
2. Generating the image at the DALL-E size
3. Using Sharp to resize/crop to your exact dimensions

**Examples:**
- 3:2 (1536x1024) → Generate at 1792x1024, crop to 1536x1024
- 16:9 (1920x1080) → Generate at 1792x1024, resize to 1920x1080
- 1024x768 → Generate at 1024x1024, resize to 1024x768

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Type check
npm run typecheck

# Development mode
npm run dev
```

## Project Structure

```
@tmgbabul/ai-image-generator/
├── bin/
│   └── cli.js                    # Shebang entry point
├── src/
│   ├── index.ts                  # CLI entry with Commander
│   ├── commands/
│   │   ├── generate.ts           # Image generation command
│   │   └── config.ts             # Configuration command
│   ├── services/
│   │   ├── openai.ts             # OpenAI API wrapper
│   │   └── image-processor.ts   # Sharp-based processing
│   ├── utils/
│   │   ├── size-mapper.ts        # Size mapping logic
│   │   ├── config-manager.ts     # Config file handling
│   │   └── validators.ts         # Input validation
│   └── types/
│       └── index.ts              # TypeScript interfaces
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## Error Handling

The CLI provides helpful error messages:

- `✗ OpenAI API key not found. Run: @tmgbabul/ai-image-gen config set OPENAI_API_KEY sk-xxxxx`
- `✗ Invalid size format. Use aspect ratio (e.g., 3:2) or dimensions (e.g., 1024x768)`
- `✗ Quality 'hd' requires dall-e-3 model`

## Requirements

- Node.js 18 or higher
- OpenAI API key with DALL-E access

## License

MIT
