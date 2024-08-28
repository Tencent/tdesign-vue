<template>
  <t-empty :description="description" :title="title">
    <template #action>
      <t-button @click="goToIndex">返回首页</t-button>
    </template>
  </t-empty>
</template>
<script>
export default {
  data() {
    return {
      title: '空状态 Empty',
      description: '暂无数据 Description',
      timer: null,
    };
  },
  methods: {
    goToIndex() {
      console.log('go to index');
      location.href = '/';
    },
  },
};
</script>
