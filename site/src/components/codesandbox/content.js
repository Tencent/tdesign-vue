import orgPkg from '../../../../package.json';

export const htmlContent = `<div id="app"></div>`;

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

  /* swiper 组件示例展示 */
  .tdesign-demo-block--swiper .demo-item {
    display: flex;
    height: 280px;
    background-color: #4b5b76;
    color: #fff;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 20px;
  }
`;

export const packageJSONContent = (name) => {
  return {
    name: name,
    dependencies: {
      'tdesign-vue': orgPkg.version,
      'tdesign-icons-vue': orgPkg.dependencies['tdesign-icons-vue'],
      vue: orgPkg.devDependencies.vue,
      'lodash-es': orgPkg.dependencies['lodash-es'],
    },
    devDependencies: {
      less: orgPkg.devDependencies.less,
      '@vue/cli-plugin-babel': '~4.5.0',
      'vue-template-compiler': orgPkg.devDependencies['vue-template-compiler'],
      '@types/lodash-es': orgPkg.devDependencies['@types/lodash-es'],
    },
  };
};

export const packageJSONContentForComposition = (name) => {
  return {
    name: name,
    dependencies: {
      'tdesign-vue': orgPkg.version + '-naruto',
      'tdesign-icons-vue': orgPkg.dependencies['tdesign-icons-vue'],
      vue: '2.7.14',
    },
    devDependencies: {
      less: orgPkg.devDependencies.less,
    },
  };
};
