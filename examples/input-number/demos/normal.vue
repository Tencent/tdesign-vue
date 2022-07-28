<template>
  <div>
    <div>
      <t-input-number v-model="value" theme="normal" :max="15" :min="-2"></t-input-number>
    </div>

    <div>
      <t-input-number v-model="value" theme="normal" align="right">
        <template #label><span>金额：</span></template>
        <template #suffix><span>元</span></template>
      </t-input-number>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 3,
    };
  },
};
</script>
