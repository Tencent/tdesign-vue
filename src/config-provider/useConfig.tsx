import { computed, inject, h } from '@vue/composition-api';
import cloneDeep from 'lodash/cloneDeep';
import _mergeWith from 'lodash/mergeWith';
import { defaultGlobalConfig, GlobalConfigProvider } from './context';

// deal with https://github.com/lodash/lodash/issues/1313
export const merge = (defaultGlobalConfig: GlobalConfigProvider, injectConfig: GlobalConfigProvider) => _mergeWith(defaultGlobalConfig, injectConfig, (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return srcValue;
  }
});

/**
 * component global config
 * @param componentName
 * @returns {t, global}
 * useConfig('pagination')
 */
export function useConfig<T extends keyof GlobalConfigProvider>(componentName?: T) {
  const mergedGlobalConfig = computed(() => {
    const globalConfig = inject<GlobalConfigProvider>('globalConfig', Object.create(null));
    const mergedGlobalConfig = merge(cloneDeep(defaultGlobalConfig), globalConfig);
    return mergedGlobalConfig;
  });

  const global = computed(() => mergedGlobalConfig.value[componentName]);

  const classPrefix = computed(() => mergedGlobalConfig.value.classPrefix);

  // 处理正则表达式
  const t = function <T> (pattern: T, data?: Record<string, string | number>) {
    if (typeof pattern === 'string') {
      if (!data) return pattern;
      const regular = /\{\s*([\w-]+)\s*\}/g;
      const translated = pattern.replace(regular, (match, key) => {
        if (data) {
          return String(data[key]);
        }
        return '';
      });
      return translated;
    }
    if (typeof pattern === 'function') {
      // 重要：组件的渲染必须存在参数 h，不能移除
      return pattern(data ?? h);
    }
    return '';
  };

  return {
    t,
    global,
    classPrefix,
  };
}

export function usePrefixClass(componentName?: string) {
  const { classPrefix } = useConfig('classPrefix');
  return computed(() => (componentName ? `${classPrefix.value}-${componentName}` : classPrefix.value));
}
