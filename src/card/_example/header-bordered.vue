<template>
  <div class="tdesign-demo-block demo-card">
    <t-card :title="title" header-bordered :style="{ width: '400px' }">
      {{ infoMessage }}
      <template #actions>
        <a href="javascript:void(0)" @click="clickHandler">操作</a>
      </template>
    </t-card>
  </div>
</template>
<script>
import { MessagePlugin } from 'tdesign-vue';

export default {
  data() {
    return {
      title: '标题',
      infoMessage: '卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。',
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
.demo-card /deep/ .t-card__actions {
  line-height: 24px;
}
</style>
