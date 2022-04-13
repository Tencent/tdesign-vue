<template>
  <div class="tdesign-demo-block">
    <t-row :align="'middle'" :gutter="16">
      <t-col :span="6">
        <t-card :title="title" :subtitle="subtitle" :cover="cover">
          <template #actions>
            <t-dropdown :options="options" :min-column-width="112" @click="clickHandler">
              <div class="tdesign-demo-dropdown-trigger">
                <t-button variant="text">
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
                <t-divider theme="vertical" />
              </t-col>
              <t-col flex="auto">
                <t-button block variant="text">
                  <chat-icon size="24" />
                </t-button>
              </t-col>
              <t-col flex="none">
                <t-divider theme="vertical" />
              </t-col>
              <t-col flex="auto">
                <t-button block variant="text">
                  <share-icon size="24" />
                </t-button>
              </t-col>
            </t-row>
          </template>
        </t-card>
      </t-col>
    </t-row>
  </div>
</template>
<script lang="jsx">
import {
  ThumbUpIcon, ChatIcon, ShareIcon, MoreIcon, UserIcon,
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
      title: '标题',
      subtitle: '副标题',
      image: 'https://tdesign.gtimg.com/site/avatar.jpg',
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
    icon() {
      return <UserIcon />;
    },
    clickHandler() {
      MessagePlugin.success('操作');
    },
  },
};
</script>
