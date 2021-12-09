<template>
  <div class="demo-slider">
    <div class="block">
      <t-slider v-model="value1" />
    </div>

    <div class="block">
      <t-slider v-model="value2" range :tooltipProps="{}"/>
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
};
</script>
<style>
.block {
  padding: 30px 24px;
}
</style>
