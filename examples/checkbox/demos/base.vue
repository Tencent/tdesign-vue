<template>
  <div>
    <div>
      <t-checkbox>默认状态</t-checkbox>
      <t-checkbox :checked="false">未选中状态</t-checkbox>
      <t-checkbox :checked="true">选中状态</t-checkbox>
      <t-checkbox indeterminate>半选状态</t-checkbox>
    </div>
    <br>
    <div>
      <t-checkbox v-model="checked1">语法糖（v-model）</t-checkbox>
      <t-checkbox :checked="true" @change="onChange">受控属性</t-checkbox>
      <t-checkbox :defaultChecked="false" :onChange="onChange">非受控属性</t-checkbox>
    </div>
    <br>
    <div>
      <t-checkbox disabled>未选中禁用状态</t-checkbox>
      <t-checkbox disabled :checked="true">选中禁用状态</t-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked1: true,
    };
  },
  methods: {
    onChange(value, context) {
      console.log('change: ', value, context);
    },
  },
};
</script>

<style scoped>
.t-checkbox + .t-checkbox {
  margin-left: 16px;
}
</style>
