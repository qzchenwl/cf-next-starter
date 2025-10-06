import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    '@storybook/addon-controls',
    '@storybook/addon-backgrounds',
    '@storybook/addon-viewport',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
  viteFinal: async (viteConfig) => {
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias ?? {}),
      '@': fileURLToPath(new URL('../src', import.meta.url)),
    };

    return viteConfig;
  },
};

export default config;

