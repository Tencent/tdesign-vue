<template>
  <div class="tdesign-demo-select-base">
    <t-select v-model="value1" :options="options1" placeholder="请选择" />
    <br /><br />
    <t-select v-model="value2" :options="options1" placeholder="请选择" multiple />
  </div>
</template>

<script lang="jsx">
const options = [];
for (let i = 0; i < 100; i++) {
  options.push({ label: `第 ${i} 项`, value: i });
}
export default {
  data() {
    return {
      value1: 50,
      value2: [50, 70],
      options1: options,
    };
  },
};
</script>

<style scoped>
.tdesign-demo-select-base {
  width: 800px;
  display: flex;
}

.tdesign-demo-select-base .t-select__wrap + .t-select__wrap {
  margin-left: 36px;
}
</style>
