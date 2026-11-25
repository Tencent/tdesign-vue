// CI 用依赖覆盖切换到 Vue 2.7，不改动任何源码或测试文件。
// 2.6 / 2.7 的测试配置由 vitest.config.js 按已安装版本自动选择。
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const pkgPath = path.resolve('package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

const versions = {
  vue: '~2.7.16',
  'vue-template-compiler': '~2.7.16',
  'vue-server-renderer': '~2.7.16',
};

Object.entries(versions).forEach(([name, version]) => {
  if (pkg.devDependencies?.[name]) pkg.devDependencies[name] = version;
});

pkg.pnpm = {
  ...pkg.pnpm,
  overrides: { ...pkg.pnpm?.overrides, ...versions },
};
pkg.overrides = { ...pkg.overrides, ...versions };

writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
