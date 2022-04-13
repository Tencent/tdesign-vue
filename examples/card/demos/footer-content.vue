<template>
  <div class="tdesign-demo-block">
    <t-card :cover="cover" theme="poster2">
      <template #footer>
        <t-comment avatar="https://tdesign.gtimg.com/site/avatar.jpg" author="标题" content="卡片内容" />
      </template>
    </t-card>
  </div>
</template>
<script setup lang="jsx">
import { MoreIcon } from 'tdesign-icons-vue';

import { MessagePlugin } from 'tdesign-vue';

export default {
  components: {
    MoreIcon,
  },
  data() {
    return {
      cover: 'https://tdesign.gtimg.com/site/source/card-demo.png',
    };
  },
  methods: {
    clickHandler(data) {
      MessagePlugin.success(`选中【${data.content}】`);
    },
  },
};
</script>
