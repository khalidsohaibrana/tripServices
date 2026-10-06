#!/usr/bin/env node
const path = require('path');
const {spawnSync} = require('child_process');
const {prepare} = require('./brand');

const root = path.resolve(__dirname, '..');
const [id = process.env.BRAND || 'trip-services', ...args] =
  process.argv.slice(2);

async function main() {
  await prepare(id);

  const gradle = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
  const result = spawnSync(
    gradle,
    [':app:assembleBrandedDebug', ...args],
    {
      cwd: path.join(root, 'android'),
      env: {...process.env, BRAND: id},
      stdio: 'inherit',
    },
  );

  process.exit(result.status ?? 1);
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
