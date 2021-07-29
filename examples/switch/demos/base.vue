<template>
  <div class="switch-demo">
    <div class="tdesign-demo-block">
      <t-switch size="large"></t-switch>
      <t-switch size="large" v-model="checked" @change="onChange"></t-switch>
    </div>
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

<style scoped>
.switch-demo .tdesign-demo-block {
  width: 300px;
  display: flex;
  justify-content: space-around;
}
</style>
