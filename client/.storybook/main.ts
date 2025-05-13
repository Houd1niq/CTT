import type {StorybookConfig} from '@storybook/react-vite';
import {mergeConfig} from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      css: {
        modules: {
          localsConvention: 'camelCase',
        },
      },
      resolve: {
        alias: {
          '@shared': '/src/shared',
          '@entities': '/src/entities',
          '@features': '/src/features',
          '@widgets': '/src/widgets',
          '@app': '/src/app',
          '@pages': '/src/pages',
        },
      },
    });
  },
};

export default config;
