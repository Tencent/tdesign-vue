<template>
  <t-comment
    avatar="https://tdesign.gtimg.com/site/avatar.jpg"
    author="评论作者名"
    datetime="今天16:38"
    content="这里是评论者写的评论内容。"
  >
    <template #actions>
      <span key="thumbUp">
        <thumb-up-icon />
        <span class="action-text">6</span>
      </span>
      <span key="chat">
        <chat-icon />
        <span class="action-text">回复</span>
      </span>
    </template>
  </t-comment>
</template>

<script>
import { ThumbUpIcon, ChatIcon } from 'tdesign-icons-vue';

export default {
  components: {
    ThumbUpIcon,
    ChatIcon,
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
