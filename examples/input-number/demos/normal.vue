<template>
  <div style="display: flex; justify-content: space-between">
    <t-input-number v-model="value" theme="normal" :max="15" :min="-2"></t-input-number>

    <t-input-number v-model="value" theme="normal" align="right" style="width: 130px">
      <template #label><span>金额：</span></template>
      <template #suffix><span>元</span></template>
    </t-input-number>

    <t-input-number
      v-model="value"
      theme="normal"
      align="right"
      label="机器："
      suffix="台"
      style="width: 130px"
    ></t-input-number>
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
