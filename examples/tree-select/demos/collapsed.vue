<template>
  <div class="tdesign-tree-select-collapsed">
    <t-tree-select
      v-model="value"
      :data="options"
      class="demo-space"
      multiple
      clearable
      placeholder="请选择"
      :minCollapsedNum="1"
    >
    </t-tree-select>
    <t-tree-select
      v-model="slotValue"
      :data="options"
      multiple
      clearable
      placeholder="请选择"
      :minCollapsedNum="1"
    >
      <template slot="collapsedItems">
        <t-tag>更多...</t-tag>
      </template>
    </t-tree-select>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: ['guangzhou', 'shenzhen'],
      slotValue: ['guangzhou', 'shenzhen'],
      options: [{
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
      }],
    };
  },
};
</script>
<style scoped>
.tdesign-tree-select-collapsed {
  width: 300px;
  margin: 0 20px;
}
.demo-space {
  margin-bottom: 20px;
}
</style>
