<template>
  <div class="tdesign-demo-block-row">
    <t-rate :value="value" :readonly="readonly"></t-rate>
  </div>
</template>
<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      value: 3,
      readonly: true,
    };
  },
});
</script>
