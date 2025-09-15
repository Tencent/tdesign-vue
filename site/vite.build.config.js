import path from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import ScriptSetup from 'unplugin-vue2-script-setup/vite';
import changelog2Json from './plugins/changelog-to-json';
import tdocPlugin from './plugins/plugin-tdoc';
import router from './site.config.mjs';
import fs from 'node:fs';

const outDir = '../_site';

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
export default ({ mode }) => {
  return defineConfig({
    base: '/',
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
      outDir,
    },
    plugins: [
      createVuePlugin({
        include: /(\.md|\.vue)$/,
        jsx: true,
      }),
      tdocPlugin(),
      changelog2Json(),
      ScriptSetup({}),
      disableTreeShakingPlugin(['style/']),
      {
        name: 'generate-multiple-entries',
        enforce: 'post',
        closeBundle() {
          const templatePath = path.resolve(outDir, './index.html');
          const templateContent = fs.readFileSync(templatePath, 'utf-8');

          function ensureDirectoryExistence(filePath) {
            let dirname = path.dirname(filePath);
            if (fs.existsSync(dirname)) return true;
            ensureDirectoryExistence(dirname);
            fs.mkdirSync(dirname);
          }

          router.docs.forEach((parent) => {
            parent.children.map((route) => {
              const htmlPath = path.join(outDir, `${route.path}`);
              if (ensureDirectoryExistence(htmlPath)) fs.writeFileSync(htmlPath, templateContent, 'utf-8');
            });
          });
        },
      },
    ],
  });
};
