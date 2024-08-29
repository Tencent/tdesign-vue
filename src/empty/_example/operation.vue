<template>
  <t-empty>
    <template #action>
      <t-button @click="goToIndex">返回首页</t-button>
    </template>
  </t-empty>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    goToIndex() {
      console.log('go to index');
      location.href = '/';
    },
  },
};
</script>
