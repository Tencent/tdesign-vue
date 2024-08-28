<template>
  <t-empty>
    <template #action>
      <t-button @click="goToIndex">返回首页</t-button>
    </template>
  </t-empty>
</template>
<script setup>
function goToIndex() {
  console.log('go to index');
  location.href = '/';
}
</script>
