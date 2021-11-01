<template>
  <div class="tdesign-demo-item--datepicker">
    <t-date-picker theme="primary" mode="date" range :placeholder="['开始时间', '结束时间']" />
    <br>
    <br>
    <t-date-picker
      theme="primary"
      mode="date"
      range
      format="YYYY-MM-DD HH:mm:ss"
      enableTimePicker
      @pick="onPick"
    />
  </div>
</template>

<script>
export default {
  methods: {
    // 选中日期时的事件
    onPick(value, context) {
      console.log('onPick:', value, context);
    },
  },
};
</script>
