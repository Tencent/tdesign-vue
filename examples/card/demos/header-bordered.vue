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
      infoMessage: `这是一段很长很长很长很长
  很长很长很长很长很长很长很长很长很长很长很长很长很长很长
  很长很长很长很长很长很长很长很长很长很长很长的内容示例。`,
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
