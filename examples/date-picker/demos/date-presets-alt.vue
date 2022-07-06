<template>
  <t-space direction="vertical">
    <t-date-range-picker v-model="range1" :presets="presets" />
    <t-date-range-picker v-model="range2" :presets="presets" enable-time-picker />
  </t-space>
</template>

<script>
import dayjs from 'dayjs';

export default {
  data() {
    return {
      presets: {
        最近7天: [dayjs().subtract(6, 'day').toDate(), dayjs().toDate()],
        最近3天: [dayjs().subtract(2, 'day').toDate(), dayjs().toDate()],
        今天: [dayjs().toDate(), dayjs().toDate()],
      },
      range1: ['2022-01-01', '2022-08-08'],
      range2: ['2022-01-01 00:00:00', '2022-08-08 23:59:59'],
    };
  },
};
</script>
