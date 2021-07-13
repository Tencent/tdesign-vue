<template>
  <div class="tdesign-tree-select-filterable">
    <div class="operation">
      <t-radio-group v-model="type" buttonStyle="solid">
        <t-radio-button value="default">默认</t-radio-button>
        <t-radio-button value="function">自定义方法</t-radio-button>
      </t-radio-group>
    </div>
    <t-tree-select
      v-if="type === 'default'"
      v-model="value"
      :data="options"
      clearable
      filterable
      placeholder="请选择"
    />
    <t-tree-select
      v-else
      v-model="value"
      :data="options"
      clearable
      :filter="filterFunction"
      placeholder="请选择"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '1.1',
      type: 'default',
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
  methods: {
    filterFunction(searchText, node) {
      return node.data.label.indexOf(searchText) >= 0;
    },
  },
};
</script>
<style scoped>
.tdesign-tree-select-filterable {
  width: 300px;
  margin: 0 20px;
}
.operation {
  margin-bottom: 20px;
}
</style>
