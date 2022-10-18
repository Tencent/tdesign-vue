<template>
  <div>
    <t-space direction="vertical">
      <t-space>
        <t-form labelWidth="200">
          <t-form-item label="加载中" style="margin-bottom: 5px">
            <t-switch size="large" v-model="loading" @change="onChange"></t-switch>
          </t-form-item>
        </t-form>
      </t-space>
    </t-space>
    <t-timeline mode="same">
      <t-timelineItem label="2022-01-01">事件一</t-timelineItem>
      <t-timelineItem label="2022-02-01">事件二</t-timelineItem>
      <t-timelineItem label="2022-03-01">事件三</t-timelineItem>
      <t-timelineItem label="2022-04-01" :loading="loading">
        事件四
        <!-- <t-loading size="12px" slot="dot" /> -->
      </t-timelineItem>
    </t-timeline>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    onChange(val) {
      this.loading = val;
    },
  },
};
</script>
<style lang="scss" scoped></style>
