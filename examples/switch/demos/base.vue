<template>
  <div class="tdesign-demo-block-row">
    <t-switch size="large"></t-switch>
    <t-switch size="large" v-model="checked" @change="onChange"></t-switch>
  </div>
</template>

<script>

export default {
  data() {
    return {
      checked: true,
    };
  },
  methods: {
    onChange(val) {
      console.log(val);
    },
  },
};
</script>
