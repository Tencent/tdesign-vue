import Vue, { VNode } from 'vue';
import { cloneDeep } from 'lodash-es';
import { GlobalConfigProvider } from './type';
import { defaultGlobalConfig, mergeWith } from './context';
import props from './props';

export const globalConfigSymbol = '__TDESIGN__INSTANCE__GLOBAL__CONFIG__';

const ConfigProvider = Vue.extend({
  name: 'TConfigProvider',

  props,

  data() {
    return {
      defaultData: cloneDeep(defaultGlobalConfig),
      // provide 出去的是这个对象的引用，合并结果原地写回来，
      // 这样注入方读到的永远是当前值（issue #3673）。
      mergedData: {} as GlobalConfigProvider,
    };
  },
  provide(): { globalConfig: GlobalConfigProvider } {
    return {
      globalConfig: this.mergedData,
    };
  },
  created() {
    // 先求值一次，把默认配置写进 provide 出去的响应式对象
    this.$watch(
      () => this.mergedGlobalConfig,
      () => {},
      { immediate: true },
    );
  },

  computed: {
    mergedGlobalConfig() {
      const mergedGlobalConfig = mergeWith(this.defaultData as unknown as GlobalConfigProvider, this.globalConfig);
      // 用于直接调用实例、plugin的方式使用
      Vue.prototype[globalConfigSymbol] = mergedGlobalConfig;
      // 同步到 provide 出去的响应式对象上，否则切换语言后内部组件读到的还是旧快照
      Object.assign(this.mergedData, mergedGlobalConfig);
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
