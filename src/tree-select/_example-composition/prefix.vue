<template>
  <t-tree-select style="width: 300px" v-model="value" :data="options" placeholder="请输入">
    <icon slot="prefixIcon" name="user" />
  </t-tree-select>
</template>
<script setup>
import { ref } from 'vue';
import { Icon } from 'tdesign-icons-vue';

const value = ref('');
const options = ref([
  {
    label: '开发一组',
    value: 'group1',
    children: [
      {
        label: '小赵',
        value: 'zhao',
      },
      {
        label: '小钱',
        value: 'qian',
      },
    ],
  },
  {
    label: '开发二组',
    value: 'group2',
    children: [
      {
        label: '小孙',
        value: 'sun',
      },
      {
        label: '小李',
        value: 'li',
      },
    ],
  },
]);
</script>
