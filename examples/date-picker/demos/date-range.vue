<template>
  <div class="tdesign-demo-item--datepicker">
    <t-date-picker mode="date" range :placeholder="['开始时间', '结束时间']" />
    <br />
    <br />
    <t-date-picker
      mode="date"
      range
      format="YYYY-MM-DD HH:mm:ss"
      enableTimePicker
      style="width: 350px"
      @pick="onPick"
      @change="onChange"
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
    onChange(value) {
      console.log('onChange:', value);
    },
  },
};
</script>
