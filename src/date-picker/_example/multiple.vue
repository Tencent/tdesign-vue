<template>
  <t-space direction="vertical">
    <t-date-picker v-model="date" placeholder="可清除、可输入的日期选择器" clearable multiple @change="handleChange" />
  </t-space>
</template>

<script>
export default {
  data() {
    return {
      date: ['2000-01-04', '2000-01-03', '2000-01-05'],
    };
  },
  methods: {
    handleChange(value, context) {
      console.log('onChange:', value, context);
      console.log('timestamp:', context.dayjsValue.valueOf());
      console.log('YYYYMMDD:', context.dayjsValue.format('YYYYMMDD'));
    },
  },
};
</script>
