<template>
  <t-space direction="vertical">
    <h3>具备清空按钮</h3>
    <t-time-picker v-model="time1" />
    <h3>禁止清空按钮</h3>
    <t-time-picker v-model="time2" :clearable="disabledClear" />
  </t-space>
</template>

<script>
export default {
  name: 'clearable',
  data() {
    return {
      time1: '11:12:10',
      time2: '11:12:10',
      disabledClear: false,
    };
  },
  methods: {
    onClear() {
      this.time1 = null;
    },
  },
};
</script>
