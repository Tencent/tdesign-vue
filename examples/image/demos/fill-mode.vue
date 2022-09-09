<template>
  <t-space :breakLine="true" :size="16">
    <t-image
      v-for="item in mode"
      :key="item"
      src="https://tdesign.gtimg.com/demo/demo-image-1.png"
      :fit="item"
      :style="{ width: '120px', height: '120px' }"
    />
  </t-space>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      mode: ['fill', 'contain', 'cover', 'none', 'scale-down'],
    };
  },
  methods: {
    onEnter() {
      console.log('trigger enter');
    },
    onChange(val) {
      console.log(this.input, val);
    },
  },
});
</script>
