<template>
  <div class="demo-slider">
    <div class="block">
      <t-slider v-model="value1" :show-tooltip="true" :marks="marks1"> </t-slider>
    </div>

    <div class="block">
      <t-slider v-model="value2" range :show-tooltip="true" :marks="marks2"> </t-slider>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value1: 12,
      value2: [30, 70],
      marks1: {
        0: '0°C',
        8: '8°C',
        12: '12°C',
        37: '37°C',
        50: <strong style="#1989FA">50%</strong>,
        60: <button style="color: #1989FA">60</button>,
      },
      marks2: {
        0: '0°C',
        8: '8°C',
        30: '30°C',
        37: '37°C',
        50: {
          style: {
            color: '#1989FA',
          },
          label: this.$createElement('strong', '50%'),
        },
        70: '70°C',
      },
    };
  },
};
</script>
<style>
.block {
  padding: 30px 24px;
}
</style>
