import { computed, getCurrentInstance } from 'vue';

export default function useFormDisabled() {
  const formDisabled = computed(() => {
    const currentInstance = getCurrentInstance().proxy;
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
