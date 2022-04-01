<template>
  <base-usage :code="code" :configList="configList" @ConfigChange="onConfigChange">
    <component :is="renderComp" v-bind="defaultProps" />
  </base-usage>
</template>

<script>
import Vue from 'vue/dist/vue.esm';

export default {
  data() {
    return {
      configList: [
        { name: 'disabled', defaultValue: false, type: 'boolean' },
        {
          name: 'select',
          type: 'enum',
          defaultValue: 'value1',
          options: [
            { label: 'value1', value: 'value1' },
            { label: 'value 1', value: 'value 1' },
          ],
        },
      ],
      renderComp: null, // 组件实例
      defaultProps: {}, // 这里放组件渲染默认 mock 数据
      configProps: {}, // 这里放动态配置的 props
      renderCode: '<t-button>这里是组件渲染部分</t-button>', // 渲染组件用的代码
      code: '<t-button>这里是组件渲染部分</t-button>', // 复制的代码 defaultProps + configProps
    };
  },

  watch: {
    renderCode: {
      immediate: true,
      handler(v) {
        this.renderComp = Vue.compile(v);
      },
    },
  },

  methods: {
    onConfigChange(e, jsxStr) {
      // eslint-disable-next-line
      console.log('e', e, jsxStr);
    },
  },
};
</script>
