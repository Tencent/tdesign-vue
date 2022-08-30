<template>
  <div class="tdesign-demo-block">
    <time-picker-panel :value="value" @change="handleChange" />
  </div>
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
