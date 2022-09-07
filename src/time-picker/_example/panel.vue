<template>
  <time-picker-panel :value="value" @change="handleChange" />
</template>
<script>
import { TimePickerPanel } from 'tdesign-vue';

export default {
  components: {
    TimePickerPanel,
  },
  data() {
    return {
      value: '11:11:11',
    };
  },
  methods: {
    handleChange(v) {
      this.value = v;
    },
  },
};
</script>
