import { createRequire } from 'node:module';
import path from 'node:path';

// 以项目根目录为基准解析，避免配置被打包成 CJS 时 import.meta.url 失准。
const require = createRequire(path.join(process.cwd(), 'package.json'));

export function getVueVersion() {
  return require('vue/package.json').version;
}

export function isVue27() {
  return getVueVersion().startsWith('2.7');
}

// 源码保留 @vue/composition-api 的写法：
// - Vue 2.6：直接走 composition-api 插件
// - Vue 2.7：构建/测试时指向本地 shim，由它转发 Vue 内置的 composition API
// shim 提供空插件作为默认导出，兼容 `import VueCompositionAPI from '@vue/composition-api'` 的旧写法。
export function compositionApiTarget() {
  return isVue27() ? path.resolve('src/utils/composition-api-shim.ts') : '@vue/composition-api';
}
