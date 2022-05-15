<template>
  <div class="tdesign-demo-block-row">
    <t-rate :value="value" :defaultValue="defaultValue" :score="score" :personCount="personCount"></t-rate>
  </div>
</template>
<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      value: 4,
      defaultValue: 5,
      score: 8.22,
      personCount: 9999,
    };
  },
});
</script>
