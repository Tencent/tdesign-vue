import path from 'path';
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import { VitePWA } from 'vite-plugin-pwa';
import vueJsx from '@vitejs/plugin-vue2-jsx';
import tdocPlugin from './plugin-tdoc';

const publicPathMap = {
  preview: '/',
  intranet: '/vue/',
  production: 'https://static.tdesign.tencent.com/vue/',
};

// Rollup 4+ 的 tree-shaking 策略调整, 这里是为了让样式在站点构建正常
const disableTreeShakingPlugin = (paths) => ({
  name: 'disable-treeshake',
  transform(code, id) {
    for (const path of paths) {
      if (id.includes(path)) {
        return { code, map: null, moduleSideEffects: 'no-treeshake' };
      }
    }
  },
});

// https://vitejs.dev/config/
export default ({ mode }) =>
  defineConfig({
    base: publicPathMap[mode],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../'),
        '@site': path.resolve(__dirname, './'),
        '@docs': path.resolve(__dirname, './docs'),
        '@components': path.resolve(__dirname, './src/components'),
        '@common': path.resolve(__dirname, '../src/_common'),
        'tdesign-vue/es': path.resolve(__dirname, '../src'),
        'tdesign-vue': path.resolve(__dirname, '../src'),
        vue: 'vue/dist/vue.esm.js',
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
      vueJsx({}),
      tdocPlugin(),
      VitePWA(pwaConfig),
    ],
  });
