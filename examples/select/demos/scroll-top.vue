<template>
  <div class="tdesign-demo-select-base">
    <t-select v-model="value1" :options="options1" placeholder="请选择" />
    <br /><br />
    <t-select v-model="value2" :options="options1" placeholder="请选择" multiple />
    <br /><br />
    <t-select
      v-model="value3"
      :options="options2"
      placeholder="请选择"
      :scroll="{ type: 'virtual' }"
      :popup-props="{ overlayStyle: { height: '300px' } }"
    />
  </div>
</template>

<script lang="jsx">
const options1 = [];
for (let i = 0; i < 100; i++) {
  options1.push({ label: `第 ${i} 项`, value: i });
}
const options2 = [];
for (let i = 0; i < 1000; i++) {
  options2.push({ label: `选项${i + 1}`, value: String(i) });
}
export default {
  data() {
    return {
      value1: 50,
      value2: [50, 70],
      value3: '177',
      options1,
      options2,
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
