<template>
  <div class="tdesign-demo-block-row">
    <t-rate :value="value" :size="size"></t-rate>
  </div>
</template>
<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      value: 2,
      size: 24,
    };
  },
});
</script>
