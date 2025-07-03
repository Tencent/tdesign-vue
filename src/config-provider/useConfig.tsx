import {
  inject, h, ref, computed,
} from 'vue';
import { GlobalConfigProvider, defaultGlobalConfig } from './context';
import { t as commonT } from '../_common/js/global-config/t';

// 处理正则表达式
const t = function <T> (pattern: T, ...args: any[]) {
  if (typeof pattern === 'function') {
    // 重要：组件的渲染必须存在参数 h，不能移除
    if (!args.length) return pattern(h);
    return pattern(...args);
  }
  // 使用公共翻译函数，以支持复数处理
  // @ts-expect-error be passed to rest parameter
  return commonT(pattern, ...args);
};

/**
 * component global config
 * @param componentName
 * @returns {t, global}
 * useConfig('pagination')
 */
export function useConfig<T extends keyof GlobalConfigProvider>(
  componentName: T = undefined,
  componentLocale?: GlobalConfigProvider[T],
) {
  const injectGlobalConfig = inject<GlobalConfigProvider>('globalConfig', null);
  const mergedGlobalConfig = injectGlobalConfig || defaultGlobalConfig;

  // eslint-disable-next-line
  const global = computed(() => Object.assign({}, mergedGlobalConfig[componentName], componentLocale));
  const classPrefix = ref(mergedGlobalConfig.classPrefix);

  return {
    t,
    global,
    globalConfig: global,
    classPrefix,
  };
}

export function usePrefixClass(componentName?: string) {
  const { classPrefix } = useConfig('classPrefix');
  return ref(componentName ? `${classPrefix.value}-${componentName}` : classPrefix.value);
}
