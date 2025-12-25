# PWA Icons Generation Guide

## Required Icons

Generate the following icon sizes from your logo (recommended: use a transparent PNG):

### Standard Icons (for manifest.json):
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-180x180.png` (Apple Touch Icon)
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

### Additional:
- `icon-32x32.png` (favicon)

### Splash Screens (iOS):
- `splash-640x1136.png` (iPhone 5/SE)
- `splash-750x1334.png` (iPhone 6/7/8)
- `splash-1242x2208.png` (iPhone Plus)

### Screenshots (optional, for app install prompt):
- `desktop.png` (1280x720)
- `mobile.png` (750x1334)

## Tools to Generate Icons

1. **Online Tools:**
   - https://realfavicongenerator.net/
   - https://www.pwabuilder.com/imageGenerator
   - https://maskable.app/ (for maskable icons)

2. **CLI Tool (recommended):**
   ```bash
   npm install -g pwa-asset-generator
   pwa-asset-generator ./public/images/logo.png ./public/icons --background "#4A5D23" --splash-only false
   ```

3. **Manual with ImageMagick:**
   ```bash
   # Install ImageMagick first
   convert logo.png -resize 72x72 icon-72x72.png
   convert logo.png -resize 96x96 icon-96x96.png
   convert logo.png -resize 128x128 icon-128x128.png
   # ... etc
   ```

## Icon Design Guidelines

1. **Maskable Icons:** 
   - Keep important content within the center 80% (safe zone)
   - Background should extend to edges

2. **Colors:**
   - Background: `#4A5D23` (olive-600)
   - Foreground: White logo

3. **Format:**
   - PNG with transparency OR
   - PNG with solid olive background (for maskable)

## Quick Start

For now, create simple placeholder icons using your logo. You can enhance them later.

### Example SVG Icon (save as icon.svg and convert):
```svg
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="64" fill="#4A5D23"/>
  <text x="256" y="280" font-family="Georgia, serif" font-size="80" fill="white" text-anchor="middle">UBUD</text>
  <text x="256" y="340" font-family="Georgia, serif" font-size="32" fill="#9CAF7C" text-anchor="middle">StayinUBUD</text>
</svg>
```

## Verification

After adding icons, verify PWA setup:

1. Run the app in production mode:
   ```bash
   npm run build && npm start
   ```

2. Open Chrome DevTools > Application > Manifest

3. Check for any warnings or missing assets

4. Test "Add to Home Screen" functionality
