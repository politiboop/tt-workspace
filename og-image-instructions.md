# OG Image PNG Conversion Instructions

Social platforms (Twitter, Facebook, LinkedIn) require PNG or JPG for preview images. Convert these SVGs to PNG at the specified dimensions.

## Files to Convert

### 1. Research Site OG Image
- **Source:** `controversial-trump-research/public/og-image.svg`
- **Output:** `controversial-trump-research/public/og-image.png`
- **Dimensions:** 1200 x 630 px
- **How:** Open the SVG in a browser, screenshot at 1200x630, or use Figma/Canva to export as PNG

### 2. Tracker Site OG Image
- **Source:** `controversial-trump/website/static/img/og-image.svg`
- **Output:** `controversial-trump/website/static/img/og-image.png`
- **Dimensions:** 1200 x 630 px

### 3. Research Site Apple Touch Icon
- **Source:** `controversial-trump-research/public/apple-touch-icon.svg`
- **Output:** `controversial-trump-research/public/apple-touch-icon.png`
- **Dimensions:** 180 x 180 px

### 4. Tracker Site Apple Touch Icon
- **Source:** `controversial-trump/website/static/img/apple-touch-icon.svg`
- **Output:** `controversial-trump/website/static/img/apple-touch-icon.png`
- **Dimensions:** 180 x 180 px

## After Converting

Update these references from `.svg` to `.png`:

### Research Site (`controversial-trump-research/src/layouts/BaseLayout.astro`)
```
og-image.svg → og-image.png
apple-touch-icon.svg → apple-touch-icon.png
```

### Tracker Site (`controversial-trump/website/docusaurus.config.js`)
```
og-image.svg → og-image.png
apple-touch-icon.svg → apple-touch-icon.png
```

## Quick Conversion Option

If you have Node.js and want to automate it, install `sharp`:
```bash
npm install -g sharp-cli
sharp -i og-image.svg -o og-image.png resize 1200 630
sharp -i apple-touch-icon.svg -o apple-touch-icon.png resize 180 180
```

Or use any of these free tools:
- **Figma** (import SVG, export frame as PNG)
- **CloudConvert** (cloudconvert.com)
- **SVG to PNG** (svgtopng.com)
