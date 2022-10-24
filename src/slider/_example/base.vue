<template>
  <t-space direction="vertical" size="60px">
    <t-slider v-model="value1" />
    <t-slider v-model="value2" range :tooltipProps="{}" :label="renderLabel" />
  </t-space>
</template>
<script>
export default {
  data() {
    return {
      value1: 12,
      value2: [30, 70],
      tooltipProps: {},
    };
  },
  methods: {
    renderLabel(h, { value, position }) {
      console.log(`the position is ${position}`);
      return `${value}`;
    },
  },
};
</script>
