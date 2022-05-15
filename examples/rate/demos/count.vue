<template>
  <div class="tdesign-demo-block-row">
    <t-rate :value="value" :defaultValue="defaultValue"></t-rate>
  </div>
</template>
<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      value: 3,
      defaultValue: 10,
    };
  },
});
</script>
