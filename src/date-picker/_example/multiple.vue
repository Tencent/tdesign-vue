<template>
  <t-space direction="vertical">
    <t-date-picker v-model="date" placeholder="支持日期的多选" clearable multiple @change="handleChange" />
  </t-space>
</template>

<script>
export default {
  data() {
    return {
      date: ['2024-01-04'],
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
