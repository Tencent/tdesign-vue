import orgPkg from '../../../../package.json';

export const htmlContent = '<div id="app"></div>';

export const mainJsContent = `
  import Vue from 'vue';
  import TDesign from 'tdesign-vue';

  // 引入组件库全局样式资源
  import 'tdesign-vue/es/style/index.css';
  import './index.css';
  import Demo from './demo.vue';

  Vue.use(TDesign);
  Vue.config.productionTip = false;

  new Vue({
    render: (h) => h(Demo),
  }).$mount('#app');
`;

export const styleContent = `
  /* 竖排展示 demo 行间距 16px */
  .tdesign-demo-block-column {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
  }

  /* 竖排展示 demo 行间距 32px */
  .tdesign-demo-block-column-large {
    display: flex;
    flex-direction: column;
    row-gap: 32px;
  }

  /* 横排排展示 demo 列间距 16px */
  .tdesign-demo-block-row {
    display: flex;
    column-gap: 16px;
    align-items: center;
  }
`;

export const pkgContent = JSON.stringify(
  {
    name: 'tdesign-vue-demo',
    version: '0.1.0',
    private: true,
    scripts: {
      serve: 'vue-cli-service serve',
      build: 'vue-cli-service build',
      lint: 'vue-cli-service lint',
    },
    dependencies: {
      dayjs: orgPkg.devDependencies.dayjs,
      'tdesign-vue': orgPkg.version,
      'tdesign-icons-vue': orgPkg.dependencies['tdesign-icons-vue'],
      vue: orgPkg.devDependencies.vue,
    },
    devDependencies: {
      eslint: '^8.6.0',
      '@vue/cli-plugin-babel': '4.5.15',
      '@vue/cli-plugin-eslint': '4.5.15',
      '@vue/cli-service': '4.5.15',
      '@vue/babel-plugin-transform-vue-jsx': '^1.2.1',
      '@vue/babel-helper-vue-jsx-merge-props': '^1.2.1',
      'babel-eslint': '^10.1.0',
      'eslint-plugin-vue': '^8.2.0',
      'vue-template-compiler': '^2.6.14',
    },
    eslintConfig: {
      root: true,
      env: {
        node: true,
      },
      extends: ['plugin:vue/essential', 'eslint:recommended'],
      parserOptions: {
        parser: '@babel/eslint-parser',
      },
      rules: {},
    },
    browserslist: ['> 1%', 'last 2 versions', 'not dead'],
  },
  null,
  2,
);

export const babelContent = `
  {
    "plugins": ["transform-vue-jsx"]
  }
`;
