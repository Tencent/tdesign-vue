<template>
  <div class="tag-demo">
    <t-tag>默认</t-tag>
    <a class="demo-link">
      <t-tag>超链接</t-tag>
    </a>
    <t-tag disabled>失效标签</t-tag>
  </div>
</template>

<style lang="less" scoped>
.tag-demo {
  width: 500px;
  display: flex;
  > * {
    margin-right: 30px;
  }
  .demo-link {
    &:hover {
      .t-tag {
        color: #266fe8;
        cursor: pointer;
      }
    }
  }
}
</style>
