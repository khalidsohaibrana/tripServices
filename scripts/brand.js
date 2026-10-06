#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const brandsRoot = path.join(root, 'brands');
const requiredColors = [
  'primary',
  'secondary',
  'accent',
  'background',
  'surface',
  'surfaceVariant',
  'logoSurface',
  'text',
  'onPrimary',
  'textMuted',
  'border',
  'error',
  'subtleBackground',
];
const requiredAssets = [
  'logo',
  'background',
  'appIcon',
  'invoiceLogo',
  'launchImage',
];
const androidSizes = {mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192};
const iosIcons = [
  ['Icon-40.png', 40, '20x20', '2x', 'iphone'],
  ['Icon-60.png', 60, '20x20', '3x', 'iphone'],
  ['Icon-58.png', 58, '29x29', '2x', 'iphone'],
  ['Icon-87.png', 87, '29x29', '3x', 'iphone'],
  ['Icon-80.png', 80, '40x40', '2x', 'iphone'],
  ['Icon-120.png', 120, '40x40', '3x', 'iphone'],
  ['Icon-120-60pt.png', 120, '60x60', '2x', 'iphone'],
  ['Icon-180.png', 180, '60x60', '3x', 'iphone'],
  ['Icon-1024.png', 1024, '1024x1024', '1x', 'ios-marketing'],
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function requiredString(value, label) {
  assert(typeof value === 'string' && value.trim(), `${label} is required`);
  return value;
}

function readBrand(id) {
  assert(
    /^[a-z][a-z0-9-]*$/.test(id),
    'Brand ID must be lowercase letters, digits, and hyphens',
  );
  const file = path.join(brandsRoot, id, 'config.json');
  assert(fs.existsSync(file), `Unknown brand: ${id}`);
  const config = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert(config.id === id, `Brand ID in ${file} must be ${id}`);
  return config;
}

function assetPath(id, asset) {
  const assetRoot = path.join(brandsRoot, id, 'assets');
  const file = path.resolve(brandsRoot, id, asset);
  assert(
    file.startsWith(`${assetRoot}${path.sep}`),
    `Asset must be inside brands/${id}/assets: ${asset}`,
  );
  assert(fs.existsSync(file), `Missing asset: ${file}`);
  return file;
}

async function validate(id) {
  const config = readBrand(id);
  requiredString(config.displayName, 'displayName');
  assert(
    !/[\n\r$#]/.test(config.displayName) && !config.displayName.includes('//'),
    'displayName contains unsupported characters',
  );
  for (const key of ['androidApplicationId', 'iosBundleId']) {
    assert(
      /^[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z][A-Za-z0-9_]*){1,}$/.test(config[key]),
      `${key} must be a reverse DNS identifier`,
    );
  }
  const company = config.company || {};
  requiredString(company.name, 'company.name');
  requiredString(company.registrationNumber, 'company.registrationNumber');
  assert(
    typeof company.address === 'string',
    'company.address must be a string',
  );
  requiredString(company.tagline, 'company.tagline');
  for (const key of ['email', 'phone', 'website']) {
    requiredString(company.contact?.[key], `company.contact.${key}`);
  }
  requiredString(company.banking?.label, 'company.banking.label');
  assert(
    Array.isArray(company.banking?.details) &&
      company.banking.details.length > 0,
    'company.banking.details must contain at least one entry',
  );
  company.banking.details.forEach((detail, index) => {
    requiredString(detail.label, `company.banking.details[${index}].label`);
    requiredString(detail.value, `company.banking.details[${index}].value`);
  });
  const invoice = config.invoice || {};
  for (const key of [
    'currency',
    'locale',
    'title',
    'defaultNote',
    'paymentInstruction',
    'footerMessage',
    'taxLabel',
  ]) {
    requiredString(invoice[key], `invoice.${key}`);
  }
  assert(
    /^[A-Z]{3}$/.test(invoice.currency),
    'invoice.currency must be an ISO 4217 currency code',
  );
  try {
    Intl.NumberFormat(invoice.locale, {
      style: 'currency',
      currency: invoice.currency,
    }).format(0);
  } catch {
    throw new Error('Invalid invoice locale or currency');
  }
  for (const key of ['heading', 'tagline']) {
    assert(
      /^#[0-9a-fA-F]{6}$/.test(invoice.colors?.[key]),
      `invoice.colors.${key} must be a hex color`,
    );
  }
  for (const mode of ['light', 'dark']) {
    for (const key of requiredColors) {
      assert(
        /^#[0-9a-fA-F]{6}$/.test(config.theme?.[mode]?.[key]),
        `theme.${mode}.${key} must be a hex color`,
      );
    }
  }
  for (const key of requiredAssets) {
    requiredString(config.assets?.[key], `assets.${key}`);
    await sharp(assetPath(id, config.assets[key])).metadata();
  }
  const icon = await sharp(assetPath(id, config.assets.appIcon)).metadata();
  assert(
    icon.width >= 1024 && icon.height >= 1024,
    'App icon must be at least 1024x1024',
  );
  for (const otherId of fs
    .readdirSync(brandsRoot)
    .filter(
      name =>
        name !== id &&
        fs.existsSync(path.join(brandsRoot, name, 'config.json')),
    )) {
    const other = readBrand(otherId);
    for (const key of ['androidApplicationId', 'iosBundleId']) {
      assert(config[key] !== other[key], `${key} duplicates ${otherId}`);
    }
  }
  return config;
}

function write(file, contents) {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== contents) {
    fs.writeFileSync(file, contents);
  }
}

async function prepare(id) {
  const config = await validate(id);
  const assets = Object.fromEntries(
    requiredAssets.map(key => [key, assetPath(id, config.assets[key])]),
  );
  const relativeRequire = file =>
    `require(${JSON.stringify(
      path
        .relative(path.join(root, 'src/brand'), file)
        .replaceAll(path.sep, '/'),
    )})`;
  const logoBuffer = await sharp(assets.invoiceLogo)
    .resize(400, 400, {fit: 'inside'})
    .jpeg({quality: 85})
    .toBuffer();
  const selected = `// Generated by scripts/brand.js. Do not edit.\nexport const brand = ${JSON.stringify(
    config,
    null,
    2,
  )};\nexport const brandAssets = {logo: ${relativeRequire(
    assets.logo,
  )}, background: ${relativeRequire(
    assets.background,
  )}};\nexport const invoiceLogoDataUri = ${JSON.stringify(
    `data:image/jpeg;base64,${logoBuffer.toString('base64')}`,
  )};\n`;
  write(path.join(root, 'src/brand/selected.js'), selected);

  const androidRoot = path.join(root, 'android/app/src/branded/res');
  write(
    path.join(root, 'android/app/brand.properties'),
    `brandApplicationId=${config.androidApplicationId}\n`,
  );
  const xmlName = config.displayName
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
  write(
    path.join(androidRoot, 'values/strings.xml'),
    `<resources><string name="app_name">${xmlName}</string></resources>\n`,
  );
  for (const [density, px] of Object.entries(androidSizes)) {
    const folder = path.join(androidRoot, `mipmap-${density}`);
    fs.mkdirSync(folder, {recursive: true});
    const image = sharp(assets.appIcon)
      .resize(px, px, {fit: 'contain', background: '#FFFFFF'})
      .png();
    await image.clone().toFile(path.join(folder, 'ic_launcher.png'));
    await image.clone().toFile(path.join(folder, 'ic_launcher_round.png'));
  }

  const iosAssets = path.join(root, 'ios/TripServices/Images.xcassets');
  const iconFolder = path.join(iosAssets, 'BrandIcon.appiconset');
  fs.mkdirSync(iconFolder, {recursive: true});
  for (const [filename, px] of iosIcons) {
    await sharp(assets.appIcon)
      .resize(px, px, {fit: 'contain', background: '#FFFFFF'})
      .png()
      .toFile(path.join(iconFolder, filename));
  }
  write(
    path.join(iconFolder, 'Contents.json'),
    JSON.stringify(
      {
        images: iosIcons.map(([filename, , size, scale, idiom]) => ({
          filename,
          size,
          scale,
          idiom,
        })),
        info: {author: 'xcode', version: 1},
      },
      null,
      2,
    ),
  );
  const launchFolder = path.join(iosAssets, 'BrandLaunch.imageset');
  fs.mkdirSync(launchFolder, {recursive: true});
  await sharp(assets.launchImage)
    .resize(400, 400, {fit: 'inside'})
    .png()
    .toFile(path.join(launchFolder, 'launch.png'));
  write(
    path.join(launchFolder, 'Contents.json'),
    JSON.stringify(
      {
        images: [{filename: 'launch.png', idiom: 'universal'}],
        info: {author: 'xcode', version: 1},
      },
      null,
      2,
    ),
  );
  write(
    path.join(root, 'ios/Brand.xcconfig'),
    `PRODUCT_BUNDLE_IDENTIFIER = ${config.iosBundleId}\nBRAND_DISPLAY_NAME = ${config.displayName}\nASSETCATALOG_COMPILER_APPICON_NAME = BrandIcon\nIPHONEOS_DEPLOYMENT_TARGET = 15.0\nREACT_NATIVE_PATH = ${path.join(root, 'node_modules/react-native')}\nUSE_HERMES = true\n`,
  );
  console.log(`Prepared brand ${id}`);
}

async function main() {
  const [action, id = process.env.BRAND || 'trip-services'] =
    process.argv.slice(2);
  if (action === 'list') {
    const ids = fs.readdirSync(brandsRoot).filter(name =>
      /^[a-z][a-z0-9-]*$/.test(name) &&
      fs.existsSync(path.join(brandsRoot, name, 'config.json')),
    );
    console.log(JSON.stringify(ids));
  } else if (action === 'validate') {
    await validate(id);
    console.log(`Valid brand ${id}`);
  } else if (action === 'validate-all') {
    for (const brandId of fs
      .readdirSync(brandsRoot)
      .filter(name =>
        fs.existsSync(path.join(brandsRoot, name, 'config.json')),
      )) {
      await validate(brandId);
      console.log(`Valid brand ${brandId}`);
    }
  } else if (action === 'prepare') {
    await prepare(id);
  } else {
    throw new Error(
      'Usage: node scripts/brand.js list|validate|validate-all|prepare [brand-id]',
    );
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(error.message);
    process.exit(1);
  });
}
module.exports = {validate, prepare};
