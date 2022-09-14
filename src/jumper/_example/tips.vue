<template>
  <t-jumper :tips="tips" />
</template>

<script>
export default {
  data() {
    return {
      tips: { prev: '前尘忆梦', current: '回到现在', next: '展望未来' },
    };
  },
};
</script>
