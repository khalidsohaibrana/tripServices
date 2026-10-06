#!/usr/bin/env node
/**
 * Generates Android mipmap and iOS AppIcon assets from a single source image.
 * Usage: node scripts/generate-app-icons.js [path-to-image]
 * Default image: src/theme/assets/TripServicesLogo.jpeg
 *
 * Place your logo (1024x1024 or larger recommended) at the path, then run:
 *   npm run generate-icons
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const defaultSource = path.join(
  projectRoot,
  'src/theme/assets/TripServicesLogo.jpeg'
);

const androidSizes = [
  { folder: 'mipmap-mdpi', px: 48 },
  { folder: 'mipmap-hdpi', px: 72 },
  { folder: 'mipmap-xhdpi', px: 96 },
  { folder: 'mipmap-xxhdpi', px: 144 },
  { folder: 'mipmap-xxxhdpi', px: 192 },
];

const iosSizes = [
  { size: '20x20', scale: '2x', px: 40, filename: 'Icon-40.png' },
  { size: '20x20', scale: '3x', px: 60, filename: 'Icon-60.png' },
  { size: '29x29', scale: '2x', px: 58, filename: 'Icon-58.png' },
  { size: '29x29', scale: '3x', px: 87, filename: 'Icon-87.png' },
  { size: '40x40', scale: '2x', px: 80, filename: 'Icon-80.png' },
  { size: '40x40', scale: '3x', px: 120, filename: 'Icon-120.png' },
  { size: '60x60', scale: '2x', px: 120, filename: 'Icon-120-60pt.png' },
  { size: '60x60', scale: '3x', px: 180, filename: 'Icon-180.png' },
  { size: '1024x1024', scale: '1x', px: 1024, filename: 'Icon-1024.png' },
];

async function main() {
  const sharp = require('sharp');
  const sourcePath = process.argv[2] || defaultSource;

  if (!fs.existsSync(sourcePath)) {
    console.error(
      `Source image not found: ${sourcePath}\n` +
        'Place your logo at src/theme/assets/TripServicesLogo.jpeg and run again.'
    );
    process.exit(1);
  }

  const androidRes = path.join(projectRoot, 'android/app/src/main/res');
  const iosAppIcon = path.join(
    projectRoot,
    'ios/TripServices/Images.xcassets/AppIcon.appiconset'
  );

  const image = sharp(sourcePath);

  console.log('Generating Android launcher icons...');
  for (const { folder, px } of androidSizes) {
    const dir = path.join(androidRes, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    await image
      .clone()
      .resize(px, px)
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'));
    await image
      .clone()
      .resize(px, px)
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'));
  }

  console.log('Generating iOS App Icon set...');
  if (!fs.existsSync(iosAppIcon)) fs.mkdirSync(iosAppIcon, { recursive: true });
  for (const { px, filename } of iosSizes) {
    await image
      .clone()
      .resize(px, px)
      .png()
      .toFile(path.join(iosAppIcon, filename));
  }

  const contentsJson = {
    images: [
      { idiom: 'iphone', scale: '2x', size: '20x20', filename: 'Icon-40.png' },
      { idiom: 'iphone', scale: '3x', size: '20x20', filename: 'Icon-60.png' },
      { idiom: 'iphone', scale: '2x', size: '29x29', filename: 'Icon-58.png' },
      { idiom: 'iphone', scale: '3x', size: '29x29', filename: 'Icon-87.png' },
      { idiom: 'iphone', scale: '2x', size: '40x40', filename: 'Icon-80.png' },
      { idiom: 'iphone', scale: '3x', size: '40x40', filename: 'Icon-120.png' },
      {
        idiom: 'iphone',
        scale: '2x',
        size: '60x60',
        filename: 'Icon-120-60pt.png',
      },
      { idiom: 'iphone', scale: '3x', size: '60x60', filename: 'Icon-180.png' },
      {
        idiom: 'ios-marketing',
        scale: '1x',
        size: '1024x1024',
        filename: 'Icon-1024.png',
      },
    ],
    info: { author: 'xcode', version: 1 },
  };

  fs.writeFileSync(
    path.join(iosAppIcon, 'Contents.json'),
    JSON.stringify(contentsJson, null, 2)
  );

  console.log('Done. Android and iOS app icons updated.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
