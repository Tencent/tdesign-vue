<template>
  <t-space direction="vertical" size="36px">
    <!-- 单个 Checkbox 受控模式 -->
    <t-space>
      <t-checkbox v-model="checked1" @change="onChange1">语法糖（v-model）</t-checkbox>
      <t-checkbox :checked="true" @change="onChange2">受控属性</t-checkbox>
      <t-checkbox :defaultChecked="false" :onChange="onChange2">非受控属性</t-checkbox>
    </t-space>
    <!-- 复选框框组受控模式 -->
    <t-checkbox-group :value="checked2" :options="options" :onChange="onChange5" />
  </t-space>
</template>

<script setup>
import { ref } from 'vue';

const checked1 = ref(true);
const checked2 = ref([1]);
const options = ref([
  {
    label: '全选',
    checkAll: true,
  },
  {
    value: 1,
    label: '受控模式选项一',
  },
  {
    value: 2,
    label: '受控模式选项二',
  },
  {
    value: 3,
    label: '受控模式选项三',
  },
]);
const onChange1 = (val) => {
  console.log('change:', checked1.value, val);
};
const onChange2 = (value, context) => {
  console.log('change: ', value, context);
};
const onChange5 = (value, context) => {
  checked2.value = value;
  console.log('change: ', value, context);
};
</script>

<style scoped>
.t-checkbox + .t-checkbox {
  margin-left: 16px;
}
</style>
