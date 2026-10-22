<template>
  <t-space :size="48" align="start">
    <div>
      <p>all：禁用子节点参与判断，父节点半选</p>
      <t-tree v-model="allValue" :data="items" checkable expand-all check-all-affected-by="all" />
    </div>
    <div>
      <p>onlyEnabled：仅可用子节点参与判断，父节点全选</p>
      <t-tree v-model="enabledValue" :data="items" checkable expand-all check-all-affected-by="onlyEnabled" />
    </div>
  </t-space>
</template>

<script>
export default {
  data() {
    return {
      allValue: ['A', 'B'],
      enabledValue: ['A', 'B'],
      items: [{
        value: 'P',
        label: '父节点',
        children: [
          { value: 'A', label: '子节点 A' },
          { value: 'B', label: '子节点 B' },
          { value: 'D', label: '禁用子节点', disabled: true },
        ],
      }],
    };
  },
};
</script>
