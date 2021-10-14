<template>
  <div class="tdesign-tree-demo">
    <t-tree :data="items" activable hover transition/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [{
        label: '第一段',
        children: [{
          label: '第二段',
        }, {
          label: '第二段',
        }],
      }, {
        label: '第一段',
        children: [{
          label: '第二段',
        }, {
          label: '第二段',
        }],
      }, {
        label: '第一段',
        children: [{
          label: '第二段',
        }, {
          label: '第二段',
        }],
      }, {
        label: '第一段',
        children: [{
          label: '第二段',
        }, {
          label: '第二段',
        }],
      }],
    };
  },
};
</script>
<style scoped>
@import url('./common/demo.css');
</style>
