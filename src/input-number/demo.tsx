import { defineComponent, ref } from '@vue/composition-api';
import B from './input-number';

export default defineComponent({
  setup() {
    const a = ref(0);

    return <B value={a} onChange={(val) => (a.value = val)} />;
  },
});
