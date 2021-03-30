<template>
  <div>
    <t-input-number
      v-model="value"
      placeholder="请输入"
    ></t-input-number>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: undefined,
    };
  },
};
</script>
