import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

export function migratePackageJson() {
  execSync('git restore package.json');
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

  delete pkg.dependencies['@vue/composition-api'];
  delete pkg.devDependencies['vite-plugin-vue2'];

  pkg.peerDependencies = {
    ...pkg.peerDependencies,
    vue: '~2.7.14',
  };

  pkg.devDependencies = {
    ...pkg.devDependencies,
    '@vitejs/plugin-vue2': '^2.2.0',
    '@vitejs/plugin-vue2-jsx': '^1.1.0',
    '@vue/babel-preset-jsx': '^1.3.0',
    'vue-server-renderer': '^2.7.14',
    'vue-template-compiler': '^2.7.14',
    'vue-demi': '^0.13.1',
    'vue-loader': '^15.10.0',
    vue: '~2.7.14',
  };
  writeFileSync('package.json', `${JSON.stringify(pkg, null, 2)}`, 'utf8');
}

export function migrateViteConfig() {
  execSync('git restore site/vite.config.js');
  let content = readFileSync('site/vite.config.js', 'utf8');
  content = content
    .replace(
      "import { createVuePlugin } from 'vite-plugin-vue2';",
      `import vue from '@vitejs/plugin-vue2';
import vueJsx from '@vitejs/plugin-vue2-jsx';`,
    )
    .replace('createVuePlugin', 'vue')
    .replace('jsx: true,', '')
    .replace(
      'tdocPlugin(),',
      `vueJsx({}),
    tdocPlugin(),`,
    );
  writeFileSync('site/vite.config.js', content, 'utf8');
}

export function migrateVitestConfig() {
  execSync('git restore vitest.config.js');
  let content = readFileSync('vitest.config.js', 'utf8');
  content = content
    .replace(
      "import { createVuePlugin } from 'vite-plugin-vue2';",
      `import vue from '@vitejs/plugin-vue2';
import vueJsx from '@vitejs/plugin-vue2-jsx';`,
    )
    .replace('createVuePlugin', 'vue')
    .replace('jsx: true,', '')
    .replace(
      'tdocPlugin(),',
      `vueJsx({}),
    tdocPlugin(),`,
    );
  writeFileSync('vitest.config.js', content, 'utf8');
}

export function migrateJsxDts() {
  const content = `import { PluginObject } from 'vue'; // eslint-disable-line
declare module 'vue' {
  interface ComponentInternalInstance {
    // todo
    [x: string]: any;
  }

  interface ComponentCustomProps {
    [key: string]: any;
  }
}

declare module 'vue' {
  interface VueConstructor {
    _installedPlugins: PluginObject<any>[];
  }
}
`;
  writeFileSync('jsx.d.ts', content, 'utf8');
}

export function migrateTsconfig() {
  execSync('git restore tsconfig.json');
  let content = readFileSync('tsconfig.json', 'utf8');
  content = content.replace('"compileOnSave": false', `"compileOnSave": false,
  "vueCompilerOptions": {
    "target": 2.7
  }`);

  writeFileSync('tsconfig.json', content, 'utf8');
}
export function migrateBabelConfig() {
  execSync('git restore babel.config.js');
  let content = readFileSync('babel.config.js', 'utf8');
  content = content.replaceAll(
    "'@vue/babel-preset-jsx',",
    `[
      '@vue/babel-preset-jsx',
      {
        compositionAPI: true,
      },
    ],`,
  );
  writeFileSync('babel.config.js', content, 'utf8');
}
