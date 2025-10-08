#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
const { spawnSync } = require('node:child_process');

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: false,
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (typeof result.status === 'number') {
    process.exitCode = result.status;
  }

  return result;
};

if (process.env.OPENNEXT_BUILD === '1') {
  run('next', ['build']);
} else {
  run('npm', ['run', 'cf:build'], {
    env: {
      ...process.env,
      OPENNEXT_BUILD: '1',
    },
  });
}

if (process.exitCode && process.exitCode !== 0) {
  process.exit(process.exitCode);
}
