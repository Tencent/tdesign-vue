<template>
  <div class="tdesign-tree-demo">
    <t-tree :data="[]"/><br>
    <t-tree :data="[]" empty="😊 空数据（string）"/><br>
    <t-tree :data="[]" :empty="empty"/><br>
    <t-tree :data="[]"><br>
      <div slot="empty">😊 空数据（slot）</div>
    </t-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      empty(h) {
        console.log(h);
        return <div>😊 空数据（ empty props ）</div>;
      },
    };
  },
};
</script>
<style scoped>
@import url('./common/demo.css');
</style>
