<template>
  <t-space>
    <t-input-number v-model="value" theme="column"></t-input-number>

    <t-input-number
      v-model="value"
      theme="column"
      align="center"
      :max="15"
      :min="-2"
      label="数字"
      style="width: 150px"
    ></t-input-number>
  </t-space>
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
