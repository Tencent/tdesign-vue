<template>
  <div class="tdesign-tree-select-base">
    <t-tree-select
      :data="options"
      :value="defaultValue"
      placeholder="请选择"
    />
  </div>
</template>
<script>
const defaultValue = ['shenzhen', 'guangzhou'];
// const defaultValue = 'guangzhou';

const options = [{
  label: '广东省',
  value: 'guangdong',
  children: [{
    label: '广州市',
    value: 'guangzhou',
  }, {
    label: '深圳市',
    value: 'shenzhen',
  }],
}, {
  label: '江苏省',
  value: 'jiangsu',
  children: [{
    label: '南京市',
    value: 'nanjing',
  }, {
    label: '苏州市',
    value: 'suzhou',
  }],
}];

export default {
  data() {
    return {
      value: '',
      defaultValue,
      options,
    };
  },
};
</script>
<style scoped>
.tdesign-tree-select-base {
  width: 300px;
}
</style>
