import path from 'path';
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import tdocPlugin from './plugin-tdoc';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/vue/' : './',
  define: {
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../'),
      '@docs': path.resolve(__dirname, './docs'),
      '@components': path.resolve(__dirname, './src/components'),
      '@common': path.resolve(__dirname, '../src/_common'),
      'tdesign-vue': path.resolve(__dirname, '../src'),
    },
  },
  build: {
    outDir: '../_site',
  },
  server: {
    host: '0.0.0.0',
    port: 16000,
    open: '/',
    https: false,
    fs: {
      strict: false,
    },
  },
  plugins: [
    createVuePlugin({
      include: /(\.md|\.vue)$/,
      jsx: true,
    }),
    tdocPlugin(),
  ],
});
