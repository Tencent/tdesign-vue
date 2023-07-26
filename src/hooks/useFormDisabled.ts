import { computed, getCurrentInstance } from 'vue';

export function useFormDisabled() {
  const formDisabled = computed(() => {
    const currentInstance = getCurrentInstance().proxy;
    if (!currentInstance) return null;
    let { $parent } = currentInstance;
    while ($parent) {
      if ($parent.$options.name === 'TForm') {
        return $parent.$props.disabled as boolean;
      }
      $parent = $parent.$parent;
    }
    return false;
  });
  return { formDisabled };
}

export default useFormDisabled;
