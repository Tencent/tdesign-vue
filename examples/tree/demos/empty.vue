<template>
  <div class="tdesign-tree-demo">
    <t-tree :data="[]" /><br />
    <t-tree :data="[]" empty="😊 空数据（string）" /><br />
    <t-tree :data="[]" :empty="empty" /><br />
    <t-tree :data="[]"
    ><br />
      <div slot="empty">😊 空数据（slot）</div>
    </t-tree>
  </div>
</template>

<script lang="jsx">
export default {
  data() {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      empty(h) {
        return <div>😊 空数据（ empty props ）</div>;
      },
    };
  },
};
</script>

<style>
.tdesign-tree-demo .t-tree {
  margin-bottom: 20px;
}
.tdesign-tree-demo .title {
  margin-bottom: 10px;
}
.tdesign-tree-demo .tips {
  margin-bottom: 10px;
}
.tdesign-tree-demo .operations {
  margin-bottom: 10px;
}
.tdesign-tree-demo .t-form__item {
  margin-bottom: 5px;
}
.tdesign-tree-demo .t-button {
  margin: 0 10px 10px 0;
}
</style>
