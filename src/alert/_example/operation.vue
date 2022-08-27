<template>
  <div class="tdesign-demo-block">
    <t-alert theme="info" message="这是一条普通的消息提示" close>
      <template #operation>
        <span @click="handleOperation">相关操作</span>
      </template>
    </t-alert>
  </div>
</template>
<script lang="jsx">
export default {
  data() {
    return {
      warningClose: () => 'FunctionPropClose',
    };
  },
  methods: {
    handleOperation() {
      alert('operation clicked');
    },
  },
};
</script>
