<template>
  <div class="tdesign-tree-base">
    <h3>normal:</h3>
    <t-tree :data="items"/>
    <h3>string:</h3>
    <t-tree :data="items" empty="string empty"/>
    <h3>render:</h3>
    <t-tree :data="items" :empty="empty"/>
    <h3>slot:</h3>
    <t-tree :data="items">
      <div slot="empty">slot empty</div>
    </t-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: null,
      empty(createElement) {
        return createElement('div', {
          domProps: {
            innerHTML: 'render empty',
          },
        });
      },
    };
  },
};
</script>
<style scoped>
  .demo-tree-base {
    display: block;
  }
</style>
