<template>
  <div>
    <t-space direction="vertical">
      <t-space>
        <t-form labelWidth="200">
          <t-form-item label="是否倒序" style="margin-bottom: 5px">
            <t-switch size="large" v-model="reverse"></t-switch>
          </t-form-item>
        </t-form>
      </t-space>
    </t-space>
    <t-timeline mode="same" :reverse="reverse">
      <t-timelineItem label="2022-01-01">事件一</t-timelineItem>
      <t-timelineItem label="2022-02-01">事件二</t-timelineItem>
      <t-timelineItem label="2022-03-01">事件三</t-timelineItem>
      <t-timelineItem label="2022-04-01">事件四</t-timelineItem>
    </t-timeline>
  </div>
</template>
<script>
export default {
  data() {
    return {
      reverse: false,
    };
  },
};
</script>
<style lang="scss" scoped></style>
