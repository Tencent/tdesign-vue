<template>
  <div class="tdesign-demo-block-row">
    <t-color-picker-panel v-model="color" format="RGBA" :enable-alpha="true" @change="handleChange" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      color: 'red',
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
  },
};
</script>
