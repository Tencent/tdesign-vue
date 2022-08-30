<template>
  <t-space direction="vertical">
    <div class="date-picker-panel-border">
      <t-date-picker-panel @cell-click="handleCellClick" :on-change="handleChange" />
    </div>
    <div class="date-picker-panel-border">
      <t-date-picker-panel enable-time-picker @cell-click="handleCellClick" :on-change="handleChange" />
    </div>

    <div class="date-picker-panel-border">
      <t-date-range-picker-panel @cell-click="handleCellClick" :on-change="handleChange" />
    </div>
    <div class="date-picker-panel-border">
      <t-date-range-picker-panel enable-time-picker @cell-click="handleCellClick" :on-change="handleChange" />
    </div>
  </t-space>
</template>

<script>
export default {
  methods: {
    handleChange(value) {
      console.log('onChange value', value);
    },
    handleCellClick(value) {
      console.log('onPick value', value);
    },
  },
};
</script>

<style>
.date-picker-panel-border {
  border: 1px solid var(--td-border-level-2-color);
  width: fit-content;
  border-radius: 3;
}
</style>
