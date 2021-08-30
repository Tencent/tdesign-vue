<template>
  <div>
    <div class="tag-demo">
      <span>默认：</span>
      <t-tag @click="onClick">标签一</t-tag>
      <a href="https://www.tencent.com/zh-cn" target="_blank">
        <t-tag>超链接</t-tag>
      </a>
    </div>
    <div class="tag-demo">
      <span>深色：</span>
      <t-tag theme="primary">标签一</t-tag>
      <t-tag theme="success">标签二</t-tag>
      <t-tag theme="warning">标签三</t-tag>
      <t-tag theme="danger">标签四</t-tag>
    </div>
    <div class="tag-demo light">
      <span>浅色：</span>
      <t-tag theme="primary" variant="light">标签一</t-tag>
      <t-tag theme="success" variant="light">标签二</t-tag>
      <t-tag theme="warning" variant="light">标签三</t-tag>
      <t-tag theme="danger" variant="light">标签四</t-tag>
    </div>
    <div class="tag-demo plain">
      <span>朴素：</span>
      <t-tag variant="plain" theme="primary">标签一</t-tag>
      <t-tag variant="plain" theme="success">标签二</t-tag>
      <t-tag variant="plain" theme="warning">标签三</t-tag>
      <t-tag variant="plain" theme="danger">标签四</t-tag>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    onClick({ e }) {
      e.stopPropagation();
    },
  },
};
</script>

<style lang="less" scoped>
.tag-demo {
  width: 500px;
  display: flex;
  margin-bottom: 15px;
  > * {
    margin-right: 30px;
  }
}
</style>
