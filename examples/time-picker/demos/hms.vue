<template>
  <div class="tdesign-demo-block">
    <t-time-picker v-model="value" @change="timechange" @open="open" @close="close" />
  </div>
</template>

<script>
export default {
  name: 'hms',
  data() {
    return {
      value: '12:20:30',
    };
  },
  methods: {
    timechange(date, time) {
      console.log(date, time);
    },
    open() {
      console.log('open');
    },
    close() {
      console.log('close');
    },
  },
};
</script>
