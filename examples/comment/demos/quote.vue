<template>
  <t-comment
    avatar="https://tdesign.gtimg.com/list-icon.png"
    author="评论作者名"
    datetime="今天16:38"
    content="评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容。"
  >
    <template #actions>
      <span key="thumbUp">
        <icon name="thumb-up" />
        <span class="action-text">6</span>
      </span>
      <span key="chat">
        <icon name="chat" />
        <span class="action-text">回复</span>
      </span>
    </template>

    <template #quote>
      <t-comment
        author= "引用内容标题"
        content="引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容。"
      ></t-comment>
    </template>
  </t-comment>
</template>

<script>
import { Icon } from '@tencent/tdesign-icons-vue';

export default {
  components: {
    Icon,
  },
};
</script>

<style lang="less" scoped>
  .action-text {
    display: inline-block;
    margin-left: 6px;
    line-height: 15px;
  }
</style>
