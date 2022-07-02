import Vue, { PropType, VNode } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import { GlobalConfigProvider } from './type';
import { defaultGlobalConfig, mergeWith } from './context';

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
      return mergedGlobalConfig;
    },
  },

  render(): VNode {
    if (this.$slots.default.length === 1) {
      return this.$slots.default[0];
    }
    return <div>{this.$slots.default}</div>;
  },
});

export default ConfigProvider;
