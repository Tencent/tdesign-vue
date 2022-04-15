<template>
  <t-card :cover="cover" title="标题" description="卡片内容" :style="{ width: '400px' }">
    <template #avatar>
      <t-avatar image="https://tdesign.gtimg.com/site/avatar-boy.jpg" size="40px"></t-avatar>
    </template>
    <template #actions>
      <t-dropdown :options="options" :min-column-width="112" @click="clickHandler">
        <div class="tdesign-demo-dropdown-trigger">
          <t-button variant="text" shape="square">
            <more-icon size="24" />
          </t-button>
        </div>
      </t-dropdown>
    </template>
    <template #footer>
      <t-row :align="'middle'" justify="center">
        <t-col flex="auto">
          <t-button block variant="text">
            <thumb-up-icon size="24" />
          </t-button>
        </t-col>
        <t-col flex="none">
          <t-divider layout="vertical" />
        </t-col>
        <t-col flex="auto">
          <t-button block variant="text">
            <chat-icon size="24" />
          </t-button>
        </t-col>
        <t-col flex="none">
          <t-divider layout="vertical" />
        </t-col>
        <t-col flex="auto">
          <t-button block variant="text">
            <share-icon size="24" />
          </t-button>
        </t-col>
      </t-row>
    </template>
  </t-card>
</template>
<script>
import {
  ThumbUpIcon, ChatIcon, ShareIcon, MoreIcon,
} from 'tdesign-icons-vue';
import { MessagePlugin } from 'tdesign-vue';

export default {
  components: {
    ThumbUpIcon,
    ChatIcon,
    ShareIcon,
    MoreIcon,
  },
  data() {
    return {
      cover: 'https://tdesign.gtimg.com/site/source/card-demo.png',
      options: [
        {
          content: '操作一',
          value: 1,
        },
        {
          content: '操作二',
          value: 2,
        },
      ],
    };
  },
  methods: {
    clickHandler() {
      MessagePlugin.success('操作');
    },
  },
};
</script>
<style scoped>
.tdesign-demo-block /deep/ .t-card__actions {
  display: flex;
  align-items: center;
}
</style>
