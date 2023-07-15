import { computed, getCurrentInstance } from '@vue/composition-api';

export function useFormDisabled() {
  const formDisabled = computed(() => {
    const currentInstance = getCurrentInstance();
    if (!currentInstance) return null;
    let { parent } = currentInstance;
    while (parent) {
      if (parent.proxy.$options.name === 'TForm') {
        return parent.props.disabled as boolean;
      }
      parent = parent.parent;
    }
    return false;
  });
  return { formDisabled };
}

export default useFormDisabled;
