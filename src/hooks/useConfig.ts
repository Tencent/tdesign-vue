import { computed } from '@vue/composition-api';
import { useConfig } from '../config-provider/useConfig';

export function usePrefixClass(componentName?: string) {
  const { classPrefix } = useConfig('classPrefix');
  return computed(() => (componentName ? `${classPrefix.value}-${componentName}` : classPrefix.value));
}

export { useConfig };
