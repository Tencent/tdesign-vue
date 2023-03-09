<template>
  <t-space>
    <t-button variant="outline" @click="handleElement1" class="trigger-element1">已渲染的节点1</t-button>
    <t-button variant="outline" @click="handleElement2" class="trigger-element2">已渲染的节点2</t-button>
  </t-space>
</template>

<script lang="jsx">
export default {
  methods: {
    handleElement1() {
      this.$popup('.trigger-element1', '渲染文本内容', {
        placement: 'bottom',
        showArrow: true,
        trigger: 'hover',
        destroyOnClose: true,
      });
    },
    handleElement2() {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.$popup('.trigger-element2', (h) => <div>渲染的是DOM节点</div>, {
        placement: 'top',
        trigger: 'click',
      });
    },
  },
};
</script>
