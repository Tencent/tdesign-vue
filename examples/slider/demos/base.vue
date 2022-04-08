<template>
  <div class="demo-slider">
    <div class="block">
      <t-slider v-model="value1" />
    </div>

    <div class="block">
      <t-slider v-model="value2" range :tooltipProps="{}" :label="renderLabel" />
    </div>
  </div>
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
<style>
.block {
  padding: 30px 24px;
}
</style>
