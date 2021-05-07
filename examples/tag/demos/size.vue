<template>
  <div class="tag-demo">
    <t-tag size="small">标签 小</t-tag>
    <t-tag>标签 中</t-tag>
    <t-tag size="large">标签 大</t-tag>
  </div>
</template>

<style lang="less" scoped>
.tag-demo {
  width: 500px;
  display: flex;
  > * {
    margin-right: 30px;
  }
}
</style>
