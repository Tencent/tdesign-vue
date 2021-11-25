import Vue, { PropType, VNode } from 'vue';
import { GlobalConfigProvider } from './type';

const ConfigProvider = Vue.extend({
  name: 'TConfigProvider',

  props: {
    globalConfig: Object as PropType<GlobalConfigProvider>,
  },

  provide(): { globalConfig: GlobalConfigProvider } {
    return {
      globalConfig: this.globalConfig,
    };
  },

  render(): VNode {
    if (this.$slots.default.length === 1) {
      return this.$slots.default[0];
    }
    return <div>{this.$slots.default}</div>;
  },
});

export default ConfigProvider;
