<template>
  <div class="tdesign-demo-block-column-large">
    <div>
      <t-input-number v-model="value1" style="width: 300px" largeNumber :decimalPlaces="2" step="1"></t-input-number>
    </div>

    <div>
      <t-input-number v-model="value2" style="width: 300px" largeNumber step="0.888"></t-input-number>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: '19999999999999999',
      // value2: '0.8975527383412673418',
      value2: '0.2222',
    };
  },
};
</script>
