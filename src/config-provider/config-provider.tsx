import Vue, { PropType, VNode } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import { provide, computed } from '@vue/composition-api';
import { GlobalConfigProvider } from './type';
import { configProviderInjectKey, defaultGlobalConfig, mergeWith } from './context';

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

  setup(props) {
    const defaultData = cloneDeep(defaultGlobalConfig);
    provide(
      configProviderInjectKey,
      computed(() => mergeWith(defaultData, props.globalConfig)),
    );
  },

  render(): VNode {
    if (this.$slots.default.length === 1) {
      return this.$slots.default[0];
    }
    return <div>{this.$slots.default}</div>;
  },
});

export default ConfigProvider;
