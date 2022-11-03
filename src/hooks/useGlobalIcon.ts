import { useConfig } from './useConfig';
import { IconConfig } from '../config-provider/type';

// 从 globalConfig 获取 icon 配置用于覆盖组件内置 icon
// eslint-disable-next-line
export function useGlobalIcon(tdIcon: Record<string, any>) {
  const { global } = useConfig('icon');

  const resultIcon: IconConfig = {};

  Object.keys(tdIcon).forEach((key) => {
    resultIcon[key] = global.value?.[key] || tdIcon[key];
  });

  return resultIcon;
}

export default useGlobalIcon;
