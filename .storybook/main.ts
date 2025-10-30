// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const config: StorybookConfig = {
  framework: { name: '@storybook/nextjs' },
  stories: [
    '../components/**/*.stories.@(ts|tsx|mdx)',
    '../app/**/*.stories.@(ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-onboarding',
  ],
  webpackFinal: async (cfg) => {
    // Storybook-Typen sind hier etwas strikt – daher die „sichere“ Manipulation:
    cfg.resolve = cfg.resolve || {};
    // @ts-expect-error Typen sind konservativ
    cfg.resolve.plugins = [...(cfg.resolve.plugins || []), new TsconfigPathsPlugin({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    })];

    return cfg;
  },
};

export default config;
