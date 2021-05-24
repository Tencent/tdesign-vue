<template>
  <div class="tdesign-tree-select-prefix">
    <t-tree-select
      v-model="value"
      :data="options"
      placeholder="请输入"
    >
      <t-icon slot="prefixIcon" name="user" />
    </t-tree-select>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
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
.tdesign-tree-select-prefix {
  width: 300px;
  margin: 0 20px;
}
</style>
