import { defineConfig } from 'vite';
import path from 'path';
import { createVuePlugin } from 'vite-plugin-vue2';
import ScriptSetup from 'unplugin-vue2-script-setup/vite';

const testConfig = {
  exclude: ['src/**/__tests__/demo.test.js'],
  include:
    process.env.NODE_ENV === 'test-snap'
      ? ['test/snap/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
      : ['src/**/__tests__/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  globals: true,
  environment: 'jsdom',
  testTimeout: 5000,
  setupFiles: ['script/test/setup.js'],
  transformMode: {
    web: [/\.[jt]sx$/],
  },
  coverage: {
    include: ['src'],
    reporter: ['text', 'json', 'html'],
    reportsDirectory: 'test/unit/coverage',
  },
};

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'tdesign-vue/es': path.resolve(__dirname, './src'),
      'tdesign-vue': path.resolve(__dirname, './src'),
      '@test/utils': path.resolve(__dirname, './test/utils'),
      vue: 'vue/dist/vue.runtime.common.js',
    },
  },
  plugins: [
    createVuePlugin({
      include: /(\.md|\.vue)$/,
      jsx: true,
    }),
    ScriptSetup({}),
  ],
  test: testConfig,
});
