<template>
  <div class="tdesign-demo-block">
    <h3>禁用整个选择器</h3>
    <br />
    <t-time-picker v-model="time1" :disabled="true" />
    <br />
    <br />
    <h3>禁用指定时间</h3>
    <br />
    <t-time-picker :disable-time="disableTime" />
  </div>
</template>

<script>
export default {
  name: 'Disabled',
  data() {
    return {
      time1: '11:12:10',
    };
  },
  methods: {
    disableTime(h) {
      const disableHour = [1, 2, 3];
      if (h > 4) {
        return {
          hour: disableHour,
          minute: [30, 31, 32, 33, 34],
        };
      }
      return {
        hour: disableHour,
      };
    },
  },
};
</script>
