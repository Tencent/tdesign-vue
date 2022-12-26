import { GlobalIconConfig } from 'tdesign-icons-vue';
import { useConfig } from './useConfig';

// 从 globalConfig 获取 icon 配置用于覆盖组件内置 icon
// eslint-disable-next-line
export function useGlobalIcon(tdIcon: Record<string, any>) {
  const { global } = useConfig('icon');

  const resultIcon: GlobalIconConfig = {};

  Object.keys(tdIcon).forEach((key) => {
    resultIcon[key] = global.value?.[key] || tdIcon[key];
  });

  return resultIcon;
}

export default useGlobalIcon;
