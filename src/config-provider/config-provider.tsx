import Vue, { PropType, VNode } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import { GlobalConfigProvider } from './type';
import { defaultGlobalConfig, mergeWith } from './context';

export const globalConfigSymbol = '__TDESIGN__INSTANCE__GLOBAL__CONFIG__';

const ConfigProvider = Vue.extend({
  name: 'TConfigProvider',

  props: {
    globalConfig: Object as PropType<GlobalConfigProvider>,
  },

  data() {
    return {
      defaultData: cloneDeep(defaultGlobalConfig),
    };
  },
  provide(): { globalConfig: GlobalConfigProvider } {
    return {
      globalConfig: this.mergedGlobalConfig,
    };
  },

  computed: {
    mergedGlobalConfig() {
      const mergedGlobalConfig = mergeWith(this.defaultData, this.globalConfig);
      // 用于直接调用实例、plugin的方式使用
      Vue.prototype[globalConfigSymbol] = mergedGlobalConfig;
      return mergedGlobalConfig;
    },
  },

  render(): VNode {
    if (this.$slots.default?.length === 1) {
      return this.$slots.default[0];
    }
    return <div>{this.$slots.default}</div>;
  },
});

export default ConfigProvider;
