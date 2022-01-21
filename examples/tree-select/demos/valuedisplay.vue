<template>
  <div class="tdesign-tree-select-valuedisplay">
    <t-tree-select :data="options" v-model="value" clearable placeholder="请选择">
      <template #valueDisplay="{ value }"> {{ value.label }}({{ value.value }}) </template>
    </t-tree-select>
    <t-tree-select
      class="tree-select-multiple"
      :data="options"
      v-model="mulValue"
      multiple
      clearable
      filterable
      placeholder="请选择"
    >
      <template #valueDisplay="{ value, onClose }">
        <t-tag v-for="(item, index) in value" :key="index" closable :onClose="() => onClose(index)">
          {{ item.label }}({{ item.value }})
        </t-tag>
      </template>
    </t-tree-select>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: 'shenzhen',
      mulValue: ['shenzhen', 'guangzhou'],
      options: [
        {
          label: '广东省',
          value: 'guangdong',
          children: [
            {
              label: '广州市',
              value: 'guangzhou',
            },
            {
              label: '深圳市',
              value: 'shenzhen',
            },
          ],
        },
        {
          label: '江苏省',
          value: 'jiangsu',
          children: [
            {
              label: '南京市',
              value: 'nanjing',
            },
            {
              label: '苏州市',
              value: 'suzhou',
            },
          ],
        },
      ],
    };
  },
};
</script>
<style scoped>
.tdesign-tree-select-valuedisplay {
  width: 300px;
  margin: 0 20px;
}
.tree-select-multiple {
  margin-top: 20px;
}
</style>
