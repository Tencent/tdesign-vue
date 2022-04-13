<template>
  <div class="tdesign-demo-block">
    <t-row :align="'middle'" justify="start" :gutter="16">
      <t-col :span="6">
        <t-card
          :title="title"
          :subtitle="subtitle"
          :description="description"
          :actions="actions"
          hover-shadow
          @actions="clickHandler"
        >
          {{ infoMessage }}
        </t-card>
      </t-col>
    </t-row>
  </div>
</template>
<script>
import { MessagePlugin } from 'tdesign-vue';

export default {
  data() {
    return {
      title: '标题',
      subtitle: '副标题',
      description: '描述',
      actions: '操作',
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
