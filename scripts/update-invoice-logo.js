#!/usr/bin/env node
/**
 * Updates the invoice PDF company logo (base64) from the app logo image.
 * Usage: node scripts/update-invoice-logo.js [path-to-image]
 * Default image: src/theme/assets/TripServicesLogo.jpeg
 *
 * Run after placing your logo at the path:
 *   npm run update-invoice-logo
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const defaultSource = path.join(
  projectRoot,
  'src/theme/assets/TripServicesLogo.jpeg'
);
const outputFile = path.join(
  projectRoot,
  'src/services/invoices/companyLogoBase64.js'
);

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

  const buffer = await sharp(sourcePath)
    .resize(400, undefined, { fit: 'inside' })
    .jpeg({ quality: 85 })
    .toBuffer();

  const base64 = buffer.toString('base64');
  const dataUri = `'data:image/jpeg;base64,${base64}'`;

  const content = `export const companyLogoBase64 =\n  ${dataUri};\n`;

  fs.writeFileSync(outputFile, content);
  console.log('Updated src/services/invoices/companyLogoBase64.js');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
