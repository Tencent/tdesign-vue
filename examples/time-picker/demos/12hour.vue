<template>
  <div class="tdesign-demo-block">
    <t-time-picker format="HH:m:s a" :disableTime="disableTime" />
  </div>
</template>

<script>
export default {
  name: 'twelveHours',
  data() {
    return {
    };
  },
  methods: {
    disableTime(h, m, s) {
      return (((h < 13) || ((h === 13) && (m < 30))) && (s > 0));
    },
  },
};
</script>
