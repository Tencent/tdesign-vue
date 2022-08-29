<template>
  <div>
    <t-image
      v-for="item in mode"
      :key="item"
      src="https://tdesign.gtimg.com/demo/demo-image-1.png"
      :fit="item"
      :style="{ width: 120, height: 120 }"
    />
  </div>
</template>
<script>
export default {
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
};
</script>
