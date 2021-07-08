<template>
  <div class="tdesign-demo-block">
    <t-time-picker v-model="value" format="hh:mm:ss a" :disableTime="disableTime" :hideDisabledTime="false" />
  </div>
</template>

<script>
export default {
  name: 'twelveHours',
  data() {
    return {
      value: '10:20:30 PM',
    };
  },
  methods: {
    disableTime(h) {
      return h < 6;
    },
  },
};
</script>
