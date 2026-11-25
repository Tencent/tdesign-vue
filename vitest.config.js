import path from 'path';
import { defineConfig } from 'vite';
import { isVue27, compositionApiTarget } from './script/utils/composition-api-alias.mjs';

const testConfig = {
  exclude: ['src/**/__tests__/demo.test.js'],
  include:
    process.env.NODE_ENV === 'test-snap'
      ? ['test/snap/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
      : ['src/**/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
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

// 2.6 / 2.7 的 SFC 与 JSX 插件不通用：只按需加载已安装的那一组，
// 避免另一组依赖缺失导致整个测试配置无法解析。
async function createPlugins() {
  if (isVue27()) {
    const [{ default: vue }, { default: vueJsx }] = await Promise.all([
      import('@vitejs/plugin-vue2'),
      import('@vitejs/plugin-vue2-jsx'),
    ]);
    return [vue({ include: /(\.md|\.vue)$/ }), vueJsx()];
  }

  const [{ createVuePlugin }, { default: ScriptSetup }] = await Promise.all([
    import('vite-plugin-vue2'),
    import('unplugin-vue2-script-setup/vite'),
  ]);
  return [createVuePlugin({ include: /(\.md|\.vue)$/, jsx: true }), ScriptSetup({})];
}

export default defineConfig(async () => {
  const alias = {
    '@': path.resolve(__dirname, './'),
    'tdesign-vue/es': path.resolve(__dirname, './src'),
    'tdesign-vue': path.resolve(__dirname, './src'),
    '@test/utils': path.resolve(__dirname, './test/utils'),
  };
  // 2.6 保持原来的 CJS runtime 别名；2.7 走 ESM 入口以获得具名 composition API。
  if (isVue27()) {
    alias['@vue/composition-api'] = compositionApiTarget();
  } else {
    alias.vue = 'vue/dist/vue.runtime.common.js';
  }

  return {
    resolve: { alias },
    plugins: await createPlugins(),
    test: testConfig,
  };
});
