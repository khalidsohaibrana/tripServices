#!/usr/bin/env node
const path = require('path');
const {spawnSync} = require('child_process');
const {prepare} = require('./brand');

const root = path.resolve(__dirname, '..');
const [platform, id = process.env.BRAND || 'trip-services', ...args] =
  process.argv.slice(2);

async function main() {
  if (!['android', 'ios', 'start'].includes(platform)) {
    throw new Error(
      'Usage: node scripts/run-brand.js android|ios|start [brand-id] [CLI arguments]',
    );
  }
  await prepare(id);
  const cli = require.resolve('react-native/cli.js');
  const platformArgs =
    platform === 'android'
      ? [
          'run-android',
          '--mode',
          'brandedDebug',
          '--appId',
          require(`../brands/${id}/config.json`).androidApplicationId,
        ]
      : platform === 'ios'
      ? ['run-ios', '--xcconfig', path.join(root, 'ios/Brand.xcconfig')]
      : ['start'];
  const result = spawnSync(process.execPath, [cli, ...platformArgs, ...args], {
    cwd: root,
    env: {...process.env, BRAND: id},
    stdio: 'inherit',
  });
  process.exit(result.status ?? 1);
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
