<template>
  <div class="tdesign-demo-block">
    <t-time-picker format="hh:mm:ss a" :disableTime="disableTime" :hideDisabledTime="false" />
  </div>
</template>

<script>
export default {
  name: 'twelveHours',
  data() {
    return {};
  },
  methods: {
    disableTime(h, m) {
      return h < 6 || m < 30;
    },
  },
};
</script>
