<template>
  <div class="tdesign-tree-select-base">
    <t-tree-select
      :data="options"
      v-model="value"
      clearable
      placeholder="请选择"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '1.1',
      options: [{
        label: '1',
        value: '1',
        children: [{
          label: '1.1',
          value: '1.1',
        }, {
          label: '1.2',
          value: '1.2',
        }],
      }, {
        label: '2',
        value: '2',
        children: [{
          label: '2.1',
          value: '2.1',
        }, {
          label: '2.2',
          value: '2.2',
        }],
      }],
    };
  },
};
</script>
<style scoped>
.tdesign-tree-select-base {
  width: 300px;
  margin: 0 20px;
}
</style>
