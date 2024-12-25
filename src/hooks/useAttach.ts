import { computed } from '@vue/composition-api';
import { useConfig } from './useConfig';
import { AttachNode } from '../common';

const defaultAttach = 'body';

/**
 * useAttach
 *
 * 挂载节点 优先级:
 *
 * props attach -> globalConfig.attach.component -> globalConfig.attach -> default = 'body'
 */

export function useAttach(name: string, attach: AttachNode) {
  const { globalConfig } = useConfig('attach');
  const attachVal = computed<AttachNode>(
    () => attach || globalConfig.value[name] || globalConfig.value || defaultAttach,
  );

  return attachVal;
}

export default useAttach;
