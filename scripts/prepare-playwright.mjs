import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

mkdirSync(path.join('reports', 'playwright'), { recursive: true });

const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = ['playwright', 'install', 'chromium'];

if (process.platform === 'linux') {
  args.push('--with-deps');
}

const result = spawnSync(npxCommand, args, { stdio: 'inherit' });

if (result.error) {
  throw result.error;
}

if (typeof result.status === 'number' && result.status !== 0) {
  process.exit(result.status);
}
