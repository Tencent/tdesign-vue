import { execSync } from 'child_process';
import { join } from 'path';
import {
  rmSync, writeFileSync, readFileSync, existsSync, mkdirSync,
} from 'fs';

const PROJECT_NAME = 'tdesign-vue2-demo';

const TEMPLATES = {
  MAIN_JS: `
import Vue from 'vue'
import TDesign from 'tdesign-vue'
import App from './App.vue'
import 'tdesign-vue/dist/tdesign.css'

Vue.use(TDesign)

new Vue({
  render: h => h(App)
}).$mount('#app')
  `,

  APP_VUE: `
<template>
  <config-provider :global-config="zhCN">
    <Demo />
  </config-provider>
</template>

<script>
import zhCN from 'tdesign-vue/es/locale/zh_CN'

export default {
  components: {
    Demo: () => import('./Demo.vue')
  },
  data() {
    return {
      zhCN
    }
  }
}
</script>
  `,

  DEMO_VUE: `
<template>
  <t-button>按钮</t-button>
</template>

<script>
export default {}
</script>
  `,

  VITE_CONFIG_JS: `
import { createVuePlugin } from 'vite-plugin-vue2'

export default {
  plugins: [
    createVuePlugin()
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
}
  `,
};

function buildExample(projectName, vueVersion, compilerVersion, baseProjectPath, extraDeps = {}) {
  const actualProjectName = `${projectName}-compiler-${compilerVersion.replace('~', '').split('.').slice(0, 2).join('-')}`;

  console.log(`正在创建项目 ${actualProjectName}...`);

  const execPath = baseProjectPath || process.cwd();

  execSync(`npm create vite@latest ${actualProjectName} -- --template vanilla`, { stdio: 'inherit', cwd: execPath });

  const projectPath = join(execPath, actualProjectName);

  const paths = {
    main: join(projectPath, 'src/main.js'),
    app: join(projectPath, 'src/App.vue'),
    demo: join(projectPath, 'src/Demo.vue'),
    packageJson: join(projectPath, 'package.json'),
    viteConfig: join(projectPath, 'vite.config.js'),
    counterJs: join(projectPath, 'src/counter.js'),
    styleCss: join(projectPath, 'src/style.css'),
    javascriptSvg: join(projectPath, 'src/javascript.svg'),
  };

  const pkg = JSON.parse(readFileSync(paths.packageJson, 'utf8'));
  pkg.dependencies = {
    ...pkg.dependencies,
    vue: vueVersion,
    'tdesign-vue': 'latest',
    'vue-template-compiler': compilerVersion,
    ...extraDeps,
  };

  pkg.devDependencies = {
    ...pkg.devDependencies,
    'vite-plugin-vue2': '^2.2.0',
    vite: '^4.4.5',
  };

  writeFileSync(paths.packageJson, JSON.stringify(pkg, null, 2));

  // 删除不需要的文件
  [paths.counterJs, paths.styleCss, paths.javascriptSvg].forEach((file) => {
    if (existsSync(file)) rmSync(file);
  });

  // 写入新文件
  writeFileSync(paths.main, TEMPLATES.MAIN_JS.trim());
  writeFileSync(paths.app, TEMPLATES.APP_VUE.trim());
  writeFileSync(paths.demo, TEMPLATES.DEMO_VUE.trim());
  writeFileSync(paths.viteConfig, TEMPLATES.VITE_CONFIG_JS.trim());

  console.log(`项目 ${actualProjectName} 创建成功！请运行以下命令：\ncd ${actualProjectName} && pnpm install && pnpm dev`);
}

try {
  mkdirSync(PROJECT_NAME, { recursive: true });
  const projectPath = join(process.cwd(), PROJECT_NAME);
  buildExample(PROJECT_NAME, '~2.6.10', '~2.6.10', projectPath);
  buildExample(PROJECT_NAME, '~2.7.14', '~2.7.14', projectPath);
} catch (error) {
  console.error('构建过程中发生错误:', error);
  process.exit(1);
}
