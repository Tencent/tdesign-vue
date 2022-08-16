import { computed, getCurrentInstance } from '@vue/composition-api';

export default function useFormDisabled() {
  const formDisabled = computed(() => {
    const currentInstance = getCurrentInstance();
    let { parent } = currentInstance;
    while (parent) {
      if (parent.proxy.$options.name === 'TForm') {
        return parent.props.disabled;
      }
      parent = parent.parent;
    }
    return false;
  });
  return { formDisabled };
}
