<template>
  <div class="tdesign-demo-block-row">
    <t-rate :value="value" :texts="texts" :defaultValue="defaultValue"></t-rate>
    <span>{{ texts[value - 1] }}</span>
  </div>
</template>
<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      value: 2,
      defaultValue: 5,
      texts: ['极差', '失望', '一般', '满意', '惊喜'],
    };
  },
});
</script>
