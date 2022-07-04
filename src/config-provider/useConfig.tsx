import { inject, h, ref } from '@vue/composition-api';
import { GlobalConfigProvider, defaultGlobalConfig } from './context';

// 处理正则表达式
const t = function <T> (pattern: T, ...args: any[]) {
  const [data] = args;
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
    if (!args.length) return pattern(h);
    return pattern(...args);
  }
  return '';
};

/**
 * component global config
 * @param componentName
 * @returns {t, global}
 * useConfig('pagination')
 */
export function useConfig<T extends keyof GlobalConfigProvider>(componentName?: T) {
  const injectGlobalConfig = inject<GlobalConfigProvider>('globalConfig', null);
  const mergedGlobalConfig = injectGlobalConfig || defaultGlobalConfig;

  const global = ref(mergedGlobalConfig[componentName]);
  const classPrefix = ref(mergedGlobalConfig.classPrefix);

  return {
    t,
    global,
    classPrefix,
  };
}

export function usePrefixClass(componentName?: string) {
  const { classPrefix } = useConfig('classPrefix');
  return ref(componentName ? `${classPrefix.value}-${componentName}` : classPrefix.value);
}
